const router = require('express').Router();
const userController = require('./users.controller');
const staffAuthCheck = require('../../middleware/auth-staff');
const authUserCheck = require('../../middleware/auth-user');
const validate = require('../../middleware/validator');
const usersValidator = require('../../validators/users/users.validator');

router.get('/', staffAuthCheck, validate(usersValidator.getAll), userController.getAllUsers);
router.get('/:id', authUserCheck, validate(usersValidator.getById), userController.getUserById);

module.exports = router;
