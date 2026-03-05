const router = require('express').Router();
const inventoryController = require('./inventory.controller');
const staffAuthCheck = require('../../middleware/auth-staff');
const validate = require('../../middleware/validator');
const getAllInventorySchema = require('../../validators/inventory/getInventory.validator');

router.get(
  '/',
  staffAuthCheck,
  validate(getAllInventorySchema),
  inventoryController.getAllInventory,
);
router.get('/:id', inventoryController.getInventoryById);
router.patch('/:id', inventoryController.updateInventoryItemQuantity);

module.exports = router;
