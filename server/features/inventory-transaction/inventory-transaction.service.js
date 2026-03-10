const inventoryTransactionRepository = require('./inventory-transaction.repository');

exports.getAllInventoryTransactions = async (filters = {}, user) => {
  const page = parseInt(filters.page, 10) || 1;
  const limit = parseInt(filters.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const where = {};

  if (filters.type) where.type = filters.type;
  if (filters.status) where.status = filters.status;

  if (user.role === 'USER') {
    where.foster_user_id = user.id;
  }

  return inventoryTransactionRepository.findAll(where, skip, limit);
};

exports.getInventoryTransactionById = async (id) => {
  const inventoryTransaction = await inventoryTransactionRepository
    .findAll()
    .then((items) => items.find((item) => item.id === id));
  if (!inventoryTransaction) {
    return null;
  }

  return {
    id: inventoryTransaction.id,
    created_at: inventoryTransaction.created_at,
    foster_user_id: inventoryTransaction.foster_user_id,
    created_by_staff_user_id: inventoryTransaction.created_by_staff_user_id,
    item_id: inventoryTransaction.item_id,
    inventory_id: inventoryTransaction.inventory_id,
    qty_out: inventoryTransaction.qty_out,
    status: inventoryTransaction.status,
    type: inventoryTransaction.type,
    notes: inventoryTransaction.notes,
    return_date: inventoryTransaction.return_date,
  };
};

exports.createIntakeTransaction = async (body) => {
  const {
    quantity,
    status,
    notes,
    staff_user,
    foster_user,
    item_id,
    item_name,
    item_category,
    item_species,
    item_unit,
    item_is_active,
    item_brand,
    item_description,
    item_food_life_stage,
    item_crate_size,
    item_crate_status,
    item_medication_dose,
    item_medication_side_effects,
    item_medication_administration_route,
    inventory_id,
    inventory_expiration_date,
  } = body;

  return await inventoryTransactionRepository.createIntakeTransaction({
    quantity,
    status,
    notes: notes || '-',
    staff_user_id: staff_user,
    foster_user_id: foster_user,
    item_id,
    item_name,
    item_category,
    item_species,
    item_unit,
    item_is_active,
    item_brand: item_brand,
    item_description: item_description,
    item_food_life_stage,
    item_crate_size,
    item_crate_status,
    item_medication_dose,
    item_medication_side_effects: item_medication_side_effects || '',
    item_medication_administration_route,
    inventory_id,
    inventory_expiration_date: inventory_expiration_date || null,
  });
};

exports.createDistributeTransaction = async (body) => {
  const { quantity, type, status, notes, staff_user, foster_user, item_id } = body;

  return await inventoryTransactionRepository.createDistributeTransaction({
    quantity,
    type,
    status,
    notes: notes,
    staff_user_id: staff_user,
    foster_user_id: foster_user,
    item_id,
  });
};
