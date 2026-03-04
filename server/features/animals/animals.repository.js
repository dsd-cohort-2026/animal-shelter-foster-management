const prisma = require('../../connections/prisma-client');

exports.findAll = async () => {
  // TODO: this will connect to our actual DB;
  return [
    {
      id: '550e8400-e29b-41d4-a716-446655550001',
      name: 'buddy',
      chip_id: 100001,
      created_at: '2026-01-10T00:00:00.000Z',
      dob: '2023-02-15T00:00:00.000Z',
      sex: 'MALE',
      species: 'Dog',
      foster_status: 'FOSTERED',
      kennel_id: 1,
      altered: false,
      weight: 62.0,
      last_modified: '2026-02-01T00:00:00.000Z',
      picture: 'https://placehold.co/300x300',
      user_id: '550e8400-e29b-41d4-a716-446655440202',
    },
    {
      id: '550e8400-e29b-41d4-a716-446655550002',
      name: 'mittens',
      chip_id: 100002,
      created_at: '2026-01-22T00:00:00.000Z',
      dob: '2024-01-22T00:00:00.000Z',
      sex: 'FEMALE',
      species: 'Cat',
      foster_status: 'SHELTERED',
      kennel_id: 2,
      altered: true,
      weight: 9.5,
      last_modified: '2026-01-22T00:00:00.000Z',
      picture: 'https://placehold.co/300x300',
      user_id: '550e8400-e29b-41d4-a716-446655440202',
    },
    {
      id: '550e8400-e29b-41d4-a716-446655550003',
      name: 'rex',
      chip_id: 100003,
      created_at: '2026-02-01T00:00:00.000Z',
      dob: '2021-02-01T00:00:00.000Z',
      sex: 'MALE',
      species: 'Dog',
      foster_status: 'SHELTERED',
      kennel_id: 3,
      altered: false,
      weight: 75.0,
      last_modified: '2026-02-01T00:00:00.000Z',
      picture: 'https://placehold.co/300x300',
      user_id: '550e8400-e29b-41d4-a716-446655440204',
    },
  ];
};

exports.findById = async (id) => {
  const animals = await exports.findAll();
  return animals.find((animal) => animal.id === id);
};

exports.createAnimal = async (body) => {
  try {
    const newAnimal = await prisma.animal.create({
      data: {
        name: body.name,
        chip_id: body.chip_id,
        dob: body.dob,
        sex: body.sex,
        species: body.species,
        foster_status: body.foster_status,
        kennel_id: body.kennel_id,
        altered: body.altered,
        weight: body.weight,
        last_modified: body.last_modified,
        picture: body.picture,
        modified_by: { create: { staff_user_id: body.modified_by } },
      },
    });
    return newAnimal;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

exports.updateAnimalById = async (idAndBody) => {
  try {
    const { id, body } = idAndBody;
    const modified_by = body.modified_by;
    delete body.modified_by;
    const updatedAnimal = await prisma.animal.update({
      where: { id: id },
      data: {
        ...body,
        modified_by: { create: { staff_user_id: modified_by } },
      },
    });
    return updatedAnimal;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
