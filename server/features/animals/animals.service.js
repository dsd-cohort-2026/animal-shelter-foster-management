const animalRepository = require('./animals.repository');

exports.getAllAnimals = async () => {
  const animals = await animalRepository.findAll()

  const formattedAnimals = animals.map(animal => ({
    id: animal.id,
    name: animal.name.slice(0,1).toUpperCase() + animal.name.slice(1),
    species: animal.species
  }));

  return formattedAnimals;
}