const router = require('express').Router();
const animalController = require('./animals.controller');

router.get('/', animalController.getAllAnimals);

module.exports = router;