const inventoryTransactionRepository = require('./inventory-transaction.repository');

exports.getAllInventoryTransactions = async () => {
  const inventoryTransactions = await inventoryTransactionRepository.findAll();
  return inventoryTransactions.map(inventoryTransaction => ({
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
  }));
};

exports.getInventoryTransactionById = async (id) => {
  const inventoryTransaction = await inventoryTransactionRepository.findAll().then(items => items.find(item => item.id === id));
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
}

exports.createNewInventoryTransaction = async (transaction) => {

  if (!transaction) {
    return null;
  }

  return transaction;
}
