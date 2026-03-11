const animalsService = require('../animals/animals.service');
const medicalLogsService = require('../medical-logs/medical-logs.service');
const inventoryTransactionService = require('../inventory-transaction/inventory-transaction.service');
const inventoryService = require('../inventory/inventory.service');

const MAX_ROWS = 20;
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

const ANIMAL_SPECIES = new Set(['CAT', 'DOG']);
const ANIMAL_STATUSES = new Set(['SHELTERED', 'FOSTERED', 'ADOPTED']);
const ANIMAL_SEXES = new Set(['MALE', 'FEMALE']);
const TRANSACTION_TYPES = new Set(['LOAN', 'DISTRIBUTION', 'INTAKE']);
const TRANSACTION_STATUSES = new Set(['ACTIVE', 'COMPLETE']);

const baseToolDefinitions = [
  {
    name: 'get_animals',
    description:
      'Get animals in ShelterSync. Supports optional filters for species, foster status, sex, and search. For status questions (adopted/fostered/sheltered), always pass foster_status.',
    parameters: {
      type: 'object',
      properties: {
        species: { type: 'string', enum: ['CAT', 'DOG'] },
        foster_status: { type: 'string', enum: ['SHELTERED', 'FOSTERED', 'ADOPTED'] },
        status: { type: 'string', enum: ['SHELTERED', 'FOSTERED', 'ADOPTED'] },
        sex: { type: 'string', enum: ['MALE', 'FEMALE'] },
        search: { type: 'string' },
        page: { type: 'integer', minimum: 1 },
        limit: { type: 'integer', minimum: 1, maximum: MAX_ROWS },
      },
    },
  },
  {
    name: 'get_medical_logs',
    description: 'Get medical logs visible to the current user.',
    parameters: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_supply_transactions',
    description: 'Get inventory transactions (supplies/loans) visible to the current user.',
    parameters: {
      type: 'object',
      properties: {
        type: { type: 'string', enum: ['LOAN', 'DISTRIBUTION', 'INTAKE'] },
        status: { type: 'string', enum: ['ACTIVE', 'COMPLETE'] },
        page: { type: 'integer', minimum: 1 },
        limit: { type: 'integer', minimum: 1, maximum: MAX_ROWS },
      },
    },
  },
];

const staffOnlyToolDefinition = {
  name: 'get_inventory',
  description: 'Get current shelter inventory (staff only).',
  parameters: {
    type: 'object',
    properties: {},
  },
};

const toPositiveInt = (value, fallback) => {
  const num = Number.parseInt(value, 10);
  return Number.isNaN(num) || num < 1 ? fallback : num;
};

const clampLimit = (value) => Math.min(toPositiveInt(value, DEFAULT_LIMIT), MAX_ROWS);

const normalizeEnum = (value, allowedSet) => {
  if (typeof value !== 'string') return undefined;
  const normalized = value.trim().toUpperCase();
  return allowedSet.has(normalized) ? normalized : undefined;
};

const normalizeSearch = (value) => {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, 100);
};

const pickObject = (input) => (input && typeof input === 'object' ? input : {});

const unwrapArgs = (args) => {
  const raw = pickObject(args);
  return pickObject(raw.filters ? raw.filters : raw);
};

const firstDefined = (...values) => values.find((value) => value !== undefined && value !== null);

const normalizeAnimalFilters = (args) => {
  const raw = unwrapArgs(args);
  const rawFosterStatus = firstDefined(
    raw.foster_status,
    raw.status,
    raw.fosterStatus,
    raw.animal_status,
    raw.animalStatus,
  );

  return {
    species: normalizeEnum(raw.species, ANIMAL_SPECIES),
    foster_status: normalizeEnum(rawFosterStatus, ANIMAL_STATUSES),
    sex: normalizeEnum(raw.sex, ANIMAL_SEXES),
    search: normalizeSearch(raw.search),
    page: toPositiveInt(raw.page, DEFAULT_PAGE),
    limit: clampLimit(raw.limit),
  };
};

const normalizeSupplyTransactionFilters = (args) => {
  const raw = unwrapArgs(args);

  return {
    type: normalizeEnum(raw.type, TRANSACTION_TYPES),
    status: normalizeEnum(raw.status, TRANSACTION_STATUSES),
    page: toPositiveInt(raw.page, DEFAULT_PAGE),
    limit: clampLimit(raw.limit),
  };
};

const compactAnimal = (animal) => ({
  id: animal.id,
  name: animal.name,
  species: animal.species,
  sex: animal.sex,
  foster_status: animal.foster_status,
  kennel_id: animal.kennel_id,
  weight: animal.weight,
  altered: animal.altered,
  dob: animal.dob,
});

const compactMedicalLog = (log) => ({
  id: log.id,
  animal_id: log.animal_id,
  foster_user_id: log.foster_user_id,
  category: log.category,
  logged_at: log.logged_at,
  general_notes: log.general_notes,
  behavior_notes: log.behavior_notes,
  dose: log.dose,
  qty_administered: log.qty_administered,
  administered_at: log.administered_at,
  prescription: log.prescription,
});

const compactSupplyTransaction = (tx) => ({
  id: tx.id,
  created_at: tx.created_at,
  quantity: tx.quantity,
  status: tx.status,
  type: tx.type,
  notes: tx.notes,
  foster_user: tx.foster_user
    ? {
        id: tx.foster_user.id,
        first_name: tx.foster_user.first_name,
        last_name: tx.foster_user.last_name,
        role: tx.foster_user.role,
      }
    : null,
  item: tx.item
    ? {
        id: tx.item.id,
        name: tx.item.name,
        category: tx.item.category,
        species: tx.item.species,
        unit: tx.item.unit,
      }
    : null,
});

const compactInventory = (inventory) => ({
  id: inventory.id,
  quantity: inventory.quantity,
  expiration_date: inventory.expiration_date,
  item: inventory.item
    ? {
        id: inventory.item.id,
        name: inventory.item.name,
        category: inventory.item.category,
        species: inventory.item.species,
        unit: inventory.item.unit,
        brand: inventory.item.brand,
        is_active: inventory.item.is_active,
      }
    : null,
});

const takeRows = (rows) => (Array.isArray(rows) ? rows.slice(0, MAX_ROWS) : []);

exports.getToolDefinitions = (user) => {
  if (!user) {
    return [];
  }

  const definitions = [...baseToolDefinitions];

  if (user?.role === 'STAFF') {
    definitions.push(staffOnlyToolDefinition);
  }

  return definitions;
};

exports.executeTool = async (name, args, user) => {
  if (!user) {
    const err = new Error('Sign in is required to access shelter data tools.');
    err.statusCode = 401;
    throw err;
  }

  switch (name) {
    case 'get_animals': {
      const filters = normalizeAnimalFilters(args);
      const animals = await animalsService.getAllAnimals(filters, user);
      const data = takeRows(animals).map(compactAnimal);
      return { tool: name, count: data.length, data };
    }

    case 'get_medical_logs': {
      const medicalLogs = await medicalLogsService.getAllMedicalLogs(user);
      const data = takeRows(medicalLogs).map(compactMedicalLog);
      return { tool: name, count: data.length, data };
    }

    case 'get_supply_transactions': {
      const filters = normalizeSupplyTransactionFilters(args);
      const transactions = await inventoryTransactionService.getAllInventoryTransactions(
        filters,
        user,
      );
      const data = takeRows(transactions).map(compactSupplyTransaction);
      return { tool: name, count: data.length, data };
    }

    case 'get_inventory': {
      if (user?.role !== 'STAFF') {
        const err = new Error('You are not authorized to access inventory data.');
        err.statusCode = 403;
        throw err;
      }

      const inventory = await inventoryService.getAllInventory();
      const data = takeRows(inventory).map(compactInventory);
      return { tool: name, count: data.length, data };
    }

    default: {
      const err = new Error(`Unsupported tool: ${name}`);
      err.statusCode = 400;
      throw err;
    }
  }
};
