const router = require('express').Router();
const inventoryTransactionController = require('./inventory-transaction.controller');
const staffAuthCheck = require('../../middleware/auth-staff');
const authUserCheck = require('../../middleware/auth-user');
const validate = require('../../middleware/validator');
const intakeTransactionSchema = require('../../validators/inventory-transaction/intakeTransaction.validator');
const distributeTransactionSchema = require('../../validators/inventory-transaction/distributeTransaction.validator');
const inventoryTransactionValidator = require('../../validators/inventory-transaction/inventory-transaction.validator');

router.get('/', authUserCheck, validate(inventoryTransactionValidator.getAll), inventoryTransactionController.getAllInventoryTransactions);
router.get('/:id', inventoryTransactionController.getInventoryTransactionById);
router.post('/intake', staffAuthCheck, validate(intakeTransactionSchema), inventoryTransactionController.createIntakeTransaction);
router.post('/distribute', staffAuthCheck, validate(distributeTransactionSchema), inventoryTransactionController.createDistributeTransaction);

module.exports = router;
