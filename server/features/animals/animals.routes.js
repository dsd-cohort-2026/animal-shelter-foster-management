const router = require('express').Router();
const animalController = require('./animals.controller');
const staffAuthCheck = require('../../middleware/auth-staff');
const authUserCheck = require('../../middleware/auth-user');
const validate = require('../../middleware/validator');
const createAnimalSchema = require('../../validators/animals/createAnimal.validator');
const unassignAnimalSchema = require('../../validators/animals/unassignAnimal.validator');
const getAllAnimalsSchema = require('../../validators/animals/animals.validator');
const updateAnimalById = require('../../validators/animals/updateAnimalById.validator');
const assignAnimalSchema = require('../../validators/animals/assignAnimal.validator');

router.get('/', authUserCheck, validate(getAllAnimalsSchema), animalController.getAllAnimals);
router.get('/:id', animalController.getAnimalById);
router.post('/create', staffAuthCheck, validate(createAnimalSchema), animalController.createAnimal);
router.patch(
  '/:id/unassign',
  staffAuthCheck,
  validate(unassignAnimalSchema),
  animalController.unassignAnimal,
);
router.patch(
  '/:id/assign',
  staffAuthCheck,
  validate(assignAnimalSchema),
  animalController.assignAnimal,
);
router.patch('/:id', staffAuthCheck, validate(updateAnimalById), animalController.updateAnimalById);

module.exports = router;
