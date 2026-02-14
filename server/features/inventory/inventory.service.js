const inventoryRepository = require('./inventory.repository');

exports.getAllInventory = async () => {
  const inventory = await inventoryRepository.findAll();
  return inventory.map(inventoryItem => ({
    id: inventoryItem.id,
    item_id: inventoryItem.item_id,
    quantity: inventoryItem.quantity,
    expiration_date: inventoryItem.expiration_date,
  }));
};

exports.getInventoryById = async (id) => {
  const inventoryItem = await inventoryRepository.findAll().then(items => items.find(item => item.id === id));
  if (!inventoryItem) {
    return null;
  }

  return {
    id: inventoryItem.id,
    item_id: inventoryItem.item_id,
    quantity: inventoryItem.quantity,
    expiration_date: inventoryItem.expiration_date,
  };
}

exports.updateInventoryItemQuantity = async (id, quantity) => {
  const inventoryItem = await inventoryRepository.findAll().then(items => items.find(item => item.id === id));
  if (!inventoryItem) {
    return null;
  }

  inventoryItem.quantity = quantity;

  return {
    id: inventoryItem.id,
    item_id: inventoryItem.item_id,
    quantity: inventoryItem.quantity,
    expiration_date: inventoryItem.expiration_date,
  };
}
