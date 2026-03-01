const router = require('express').Router();
const animalController = require('./animals.controller');
const staffAuthCheck = require('../../middleware/auth-staff');
const validate = require('../../middleware/validator');
const createAnimalSchema = require('../../validators/animals/createAnimal.validator');

router.get('/', animalController.getAllAnimals);
router.get('/:id', animalController.getAnimalById);
router.post('/create', validate(createAnimalSchema), animalController.createAnimal);

module.exports = router;
