const inventoryRepository = require('./inventory.repository');
const inventoryTransactionRepository = require('../inventory-transaction/inventory-transaction.repository');

exports.getAllInventory = async () => {
  const inventoryData = await inventoryRepository.findAll();
  return inventoryData;
};

exports.getInventoryItemById = async (id) => {
  const inventoryItem = await inventoryRepository
    .findAll()
    .then((items) => items.find((item) => item.id === id));
  if (!inventoryItem) {
    return null;
  }

  return {
    id: inventoryItem.id,
    item_id: inventoryItem.item_id,
    quantity: inventoryItem.quantity,
    expiration_date: inventoryItem.expiration_date,
  };
};

exports.updateInventory = async (req) => {
  try {
    const inventory = {
      id: req.params.id,
      item_id: req.body.item_id,
      quantity: req.body.quantity,
      expiration_date: new Date(req.body.expiration_date) || null,
    };
    const inventory_transactions = {};
    inventory_transactions.create = {
      quantity: req.body.quantity,
      status: req.body.status,
      type: req.body.type,
      notes: req.body.notes || '-',
      staff_user: { connect: { id: req.body.staff_user } },
      item: { connect: { id: req.body.item_id } },
    };
    if (req.body.foster_user) {
      inventory_transactions.create.foster_user = { connect: { id: req.body.foster_user } };
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
