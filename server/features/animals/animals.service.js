const animalRepository = require('./animals.repository');

exports.getAllAnimals = async () => {
  const animals = await animalRepository.findAll();

  const formattedAnimals = animals.map((animal) => {
    const name = typeof animal.name === 'string' ? animal.name : '';
    const formattedName = name.length > 0 ? name.slice(0, 1).toUpperCase() + name.slice(1) : name;

    return {
      id: animal.id,
      name: formattedName,
      chip_id: animal.chip_id,
      created_at: animal.created_at,
      dob: animal.dob,
      sex: animal.sex,
      species: animal.species,
      foster_status: animal.foster_status,
      kennel_id: animal.kennel_id,
      altered: animal.altered,
      weight: animal.weight,
      last_modified: animal.last_modified,
      picture: animal.picture,
      user_id: animal.user_id,
    };
  });
  return formattedAnimals;
};

exports.getAnimalById = async (id) => {
  const animal = await animalRepository.findById(id);
  const name = typeof animal.name === 'string' ? animal.name : '';

  const formattedName = name.length > 0 ? name.slice(0, 1).toUpperCase() + name.slice(1) : name;

  return {
    id: animal.id,
    name: formattedName,
    chip_id: animal.chip_id,
    created_at: animal.created_at,
    dob: animal.dob,
    sex: animal.sex,
    species: animal.species,
    foster_status: animal.foster_status,
    kennel_id: animal.kennel_id,
    altered: animal.altered,
    weight: animal.weight,
    last_modified: animal.last_modified,
    picture: animal.picture,
    user_id: animal.user_id,
  };
};

exports.createAnimal = async (body) => {
  // json doesnt like dates, zod doesnt like json, prisma just wants a Date
  //    - safest(?) place to convert is below
  try {
    const newAnimal = await animalRepository.createAnimal({
      ...body,
      dob: new Date(body.dob),
      last_modified: new Date(body.last_modified),
    });
    return newAnimal;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

exports.updateAnimalById = async (req) => {
  try {
    const body = req.body;
    const id = req.params.id;
    const parsedBody = {};
    for (const [prop, val] of Object.entries(body)) {
      if (prop === 'dob') {
        parsedBody[prop] = new Date(val);
      } else if (prop === 'last_modified') {
        parsedBody[prop] = new Date(val);
      } else {
        parsedBody[prop] = val;
      }
    }
    const updatedAnimal = await animalRepository.updateAnimalById({
      id,
      body: parsedBody,
    });
    return updatedAnimal;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
