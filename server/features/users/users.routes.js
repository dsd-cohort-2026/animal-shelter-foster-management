const router = require('express').Router();
const userController = require('./users.controller');

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);

module.exports = router;
