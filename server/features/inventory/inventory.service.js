const inventoryRepository = require('./inventory.repository');
const inventoryTransactionRepository = require('../inventory-transaction/inventory-transaction.repository');

exports.getAllInventory = async () => {
  const inventory = await inventoryRepository.findAll();
  return inventory.map(inventoryItem => ({
    id: inventoryItem.id,
    item_id: inventoryItem.item_id,
    quantity: inventoryItem.quantity,
    expiration_date: inventoryItem.expiration_date,
  }));
};

exports.getInventoryItemById = async (id) => {
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

exports.updateInventoryItemQuantity = async (inventoryId, newQuantity, userId) => {
  const currentInventory = await inventoryRepository.findById(inventoryId);

  if (!currentInventory) {
    throw new Error("Inventory item not found");
  }

  const quantityChange = newQuantity - currentInventory.quantity;

  const updatedInventory = await inventoryRepository.update(inventoryId, {
    quantity: newQuantity,
  });

  await inventoryTransactionRepository.create({
    inventory_id: inventoryId,
    item_id: currentInventory.item_id,
    qty_out: Math.abs(quantityChange),
    status: quantityChange > 0 ? "received" : "distributed",
    type: quantityChange > 0 ? "restock" : "distribution",
    created_by_staff_user_id: userId,
    foster_user_id: null,
    notes: null,
    return_date: null,
  });

  return {
    id: updatedInventory.id,
    item_id: updatedInventory.item_id,
    quantity: updatedInventory.quantity,
    expiration_date: updatedInventory.expiration_date,
  };
}
