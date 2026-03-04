const router = require('express').Router();
const animalController = require('./animals.controller');
const staffAuthCheck = require('../../middleware/auth-staff');
const validate = require('../../middleware/validator');
const createAnimalSchema = require('../../validators/animals/createAnimal.validator');
const updateAnimalById = require('../../validators/animals/updateAnimalById.validator');

router.get('/', animalController.getAllAnimals);
router.get('/:id', animalController.getAnimalById);
router.post('/create', staffAuthCheck, validate(createAnimalSchema), animalController.createAnimal);
router.patch('/:id', staffAuthCheck, validate(updateAnimalById), animalController.updateAnimalById);

module.exports = router;
