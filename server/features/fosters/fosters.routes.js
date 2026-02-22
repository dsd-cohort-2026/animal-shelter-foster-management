const router = require('express').Router();
const fosterController = require('./fosters.controller');

router.get('/', fosterController.getAllFosters);
router.get('/:id', fosterController.getFosterById);
router.post('/', fosterController.createFoster);
router.put('/:id', fosterController.updateFoster);
router.delete('/:id', fosterController.deleteFoster);
router.get('/animal/:animalId', fosterController.getFostersByAnimal);
router.get('/user/:userId', fosterController.getFostersByUser);

module.exports = router;
