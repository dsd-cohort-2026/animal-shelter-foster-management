const inventoryRepository = require('./inventory.repository');
const inventoryTransactionRepository = require('../inventory-transaction/inventory-transaction.repository');

exports.getAllInventory = async () => {
  const inventoryData = await inventoryRepository.findAll();
  return inventoryData;
};

exports.getInventoryItemById = async (id) => {
  const inventoryItem = await inventoryRepository.findById(id);
  if (!inventoryItem) {
    return null;
  }
  return inventoryItem;
};

exports.updateInventory = async (req) => {
  try {
    if (req.body.quantity && !req.body.transaction_id) {
      const err = new Error(
        `You cannot update a quantity without also updating its corresponding transaction's quantity! Please provide a valid transaction ID!`,
      );
      err.statusCode = 400;
      throw err;
    }
    const inventory = { id: req.params.id };
    if (req.body.quantity || req.body.quantity === 0) inventory.quantity = req.body.quantity;
    if (req.body.item_id) inventory.item_id = req.body.item_id;
    if (req.body.expiration_date) inventory.expiration_date = new Date(req.body.expiration_date);

    let inventory_transactions;
    if (req.body.transaction_id) {
      const update = {};
      if (req.body.quantity || req.body.quantity === 0) update.quantity = req.body.quantity;
      if (req.body.status) update.status = req.body.status;
      if (req.body.type) update.type = req.body.type;
      if (req.body.notes) update.notes = req.body.notes;
      if (req.body.foster_user) update.foster_user = { connect: { id: req.body.foster_user } };
      update.staff_user = { connect: { id: req.body.staff_user } };
      if (req.body.item) update.item_id = { connect: { id: req.body.item_id } };
      inventory_transactions = {
        update: {
          where: { id: req.body.transaction_id },
          data: update,
        },
      };
    }

    const updatedInventory = await inventoryRepository.updateInventory({
      inventory,
      inventory_transactions,
    });
    return updatedInventory;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
