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
    const inventory = { id: req.params.id };
    if (req.body.quantity || req.body.quantity === 0) inventory.quantity = req.body.quantity;
    if (req.body.item_id) inventory.item_id = req.body.item_id;
    if (req.body.expiration_date) inventory.expiration_date = new Date(req.body.expiration_date);

    let inventory_transactions;
    if ((req.body.quantity || req.body.quantity === 0) && req.body.item_id) {
      inventory_transactions = {
        create: {
          quantity: req.body.quantity,
          status: 'COMPLETE',
          type: req.body.type || 'INTAKE',
          notes: req.body.notes || '-',
          staff_user: { connect: { id: req.body.staff_user } },
          item: { connect: { id: req.body.item_id } },
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
