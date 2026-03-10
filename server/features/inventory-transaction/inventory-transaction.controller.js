const inventoryTransactionService = require('./inventory-transaction.service');

exports.getAllInventoryTransactions = async (req, res, next) => {
  try {
    const filters = req.query || {};
    const user = req.user;
    const transactions = await inventoryTransactionService.getAllInventoryTransactions(
      filters,
      user,
    );
    res.status(200).json(transactions);
  } catch (error) {
    next(error);
  }
};

exports.getInventoryTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const inventoryTransaction = await inventoryTransactionService.getInventoryTransactionById(id);
    if (!inventoryTransaction) {
      return res.status(404).json({ message: 'Inventory transaction not found' });
    }
    res.status(200).json(inventoryTransaction);
  } catch (error) {
    console.error('Error fetching inventory transaction:', error);
    res.status(500).json({ message: 'An error occurred while fetching inventory transaction' });
  }
};

exports.createIntakeTransaction = async (req, res, next) => {
  try {
    const body = req.body;

    if (!body.item_id) {
      const missingFields = [];
      if (!body.item_name) missingFields.push('item_name');
      if (!body.item_category) missingFields.push('item_category');
      if (!body.item_species) missingFields.push('item_species');
      if (!body.item_unit) missingFields.push('item_unit');
      if (body.item_is_active === undefined) missingFields.push('item_is_active');
      if (body.item_brand === undefined) missingFields.push('item_brand');
      if (body.item_name === undefined) missingFields.push('item_name');

      if (body.item_category === 'FOOD' && !body.item_food_life_stage)
        missingFields.push('item_food_life_stage');
      if (body.item_category === 'CRATE') {
        if (!body.item_crate_size) missingFields.push('item_crate_size');
        if (!body.item_crate_status) missingFields.push('item_crate_status');
      }
      if (body.item_category === 'MEDICINE') {
        if (!body.item_medication_dose) missingFields.push('item_medication_dose');
        if (!body.item_medication_administration_route)
          missingFields.push('item_medication_administration_route');
      }

      if (missingFields.length > 0) {
        const err = new Error(
          `Missing required fields for item creation: ${missingFields.join(', ')}`,
        );
        err.statusCode = 400;
        return next(err);
      }
    }

    const result = await inventoryTransactionService.createIntakeTransaction(body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

exports.createDistributeTransaction = async (req, res, next) => {
  try {
    if (
      (req.body.type === 'LOAN' && req.body.status === 'COMPLETE') ||
      (req.body.type === 'DISTRIBUTION' && req.body.status === 'ACTIVE')
    ) {
      const err = new Error(
        `Mismatching type and status: a new ${req.body.type} cannot be ${req.body.status}`,
      );
      err.statusCode = 400;
      return next(err);
    }
    const result = await inventoryTransactionService.createDistributeTransaction(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
