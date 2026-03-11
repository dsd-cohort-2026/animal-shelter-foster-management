const router = require('express').Router();
const chatController = require('./chat.controller');
const authOptional = require('../../middleware/auth-optional');
const validate = require('../../middleware/validator');
const chatValidator = require('../../validators/chat/chat.validator');

router.post('/', authOptional, validate(chatValidator), chatController.chat);

module.exports = router;
