const router = require('express').Router();
const inventoryController = require('./inventory.controller');

router.get('/', inventoryController.getAllInventory);
router.get('/:id', inventoryController.getInventoryById);
router.patch('/:id', inventoryController.updateInventoryItemQuantity);

module.exports = router;
