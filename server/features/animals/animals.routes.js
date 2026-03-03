const router = require('express').Router();
const animalController = require('./animals.controller');
const staffAuthCheck = require('../../middleware/auth-staff');
const authUserCheck = require('../../middleware/auth-user');
const validate = require('../../middleware/validator');
const createAnimalSchema = require('../../validators/animals/createAnimal.validator');
const getAllAnimalsSchema = require('../../validators/animals/animals.validator');

router.get('/', authUserCheck, validate(getAllAnimalsSchema), animalController.getAllAnimals);
router.get('/:id', animalController.getAnimalById);
router.post('/create', staffAuthCheck, validate(createAnimalSchema), animalController.createAnimal);

module.exports = router;
