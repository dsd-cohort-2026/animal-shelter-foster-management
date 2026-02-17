const router = require('express').Router();
const inventoryTransactionController = require('./inventory-transaction.controller');

router.get('/', inventoryTransactionController.getAllInventoryTransactions);
router.get('/:id', inventoryTransactionController.getInventoryTransactionById);
router.post('/', inventoryTransactionController.createNewInventoryTransaction);

module.exports = router;
