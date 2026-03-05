const animalService = require('./animals.service');

exports.getAllAnimals = async (req, res, next) => {
  try {
    const filters = req.query || {};
    const user = req.user;
    const animals = await animalService.getAllAnimals(filters, user);
    res.status(200).json(animals);
  } catch (error) {
    next(error);
  }
};

exports.getAnimalById = async (req, res) => {
  const { id } = req.params;
  try {
    const animal = await animalService.getAnimalById(id);
    if (!animal) {
      return res.status(404).json({ message: 'Animal was not found' });
    }
    res.status(200).json(animal);
  } catch (error) {
    console.error(`Error fetching the animal with id ${id}:`, error);
    res.status(500).json({ message: 'An error occurred while fetching animal' });
  }
};

exports.createAnimal = async (req, res) => {
  try {
    const body = req.body;
    const newAnimal = await animalService.createAnimal(body);
    if (!newAnimal) {
      return res
        .status(500)
        .json({ message: 'Oh no! An error occurred while adding the new animal!' });
    }
    res.status(201).json(newAnimal);
  } catch (error) {
    console.error(`There was an error while creating the animal:`, error);
    res.status(500).json({ message: 'An error occurred while creating the animal' });
  }
};

exports.updateAnimalById = async (req, res) => {
  try {
    const updatedAnimal = await animalService.updateAnimalById(req);
    if (!updatedAnimal) {
      return res.status(400).json({ message: 'Oh no! An error occurred while updating animal!' });
    }
    res.status(201).json(updatedAnimal);
  } catch (error) {
    console.error(`There was an error while updating the animal:`, error);
    res.status(400).json({ message: 'An error occurred while updating the animal' });
  }
};

exports.assignAnimal = async (req, res) => {
  try {
    const animalAssignment = await animalService.assignAnimal(req);
    if (!animalAssignment) {
      return res
        .status(500)
        .json({ message: 'Oh no! An error occurred while adding the new animal!' });
    }
    res.status(201).json(animalAssignment);
  } catch (error) {
    console.error(`There was an error while assigning the animal:`, error);
    res.status(400).json({ message: 'An error occurred while creating the animal assignment!' });
  }
};

exports.unassignAnimal = async (req, res) => {
  try {
    const animalAssignment = await animalService.unassignAnimal(req);
    if (!animalAssignment) {
      return res
        .status(500)
        .json({ message: `Oh no! An error occurred while removing the animal's assignment!` });
    }
    res.status(200).json(animalAssignment);
  } catch (error) {
    console.error(`There was an error while unassigning the animal:`, error);
    res.status(500).json({ message: 'An error occurred while removing the animal assignment!' });
  }
};
