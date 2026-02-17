const router = require('express').Router();
const itemController = require('./items.controller');

router.get('/', itemController.getAllItems);
router.get('/:id', itemController.getItemById);

module.exports = router;
