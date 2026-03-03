const animalRepository = require('./animals.repository');

const formatAnimal = (animal) => {
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
  };
};

exports.getAllAnimals = async (filters = {}, user) => {
  const page = parseInt(filters.page, 10) || 1;
  const limit = parseInt(filters.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const where = {};

  // Applies filters
  if (filters.species) {
    where.species = filters.species;
  }
  if (filters.foster_status) {
    where.foster_status = filters.foster_status;
  }
  if (filters.sex) {
    where.sex = filters.sex;
  }
  if (filters.search) {
    const searchConditions = [
      { name: { contains: filters.search, mode: 'insensitive' } },
    ];
    const chipId = parseInt(filters.search, 10);
    if (!isNaN(chipId)) {
      searchConditions.push({ chip_id: chipId });
    }
    where.OR = searchConditions;
  }

  // Applies visibility rules
  if (user.role === 'USER') {
    // User/Foster can only see animals assigned to them with active status
    where.animal_assignments = {
      some: {
        foster_user_id: user.id,
        status: 'ACTIVE',
      },
    };
  }
  // Staff can see all animals

  const animals = await animalRepository.findAll(where, skip, limit);
  return animals.map(formatAnimal);
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
