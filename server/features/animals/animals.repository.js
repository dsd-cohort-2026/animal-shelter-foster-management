const prisma = require('../../connections/prisma-client');

exports.findAll = async (where = {}, skip = 0, take = 10) => {
  return prisma.animal.findMany({
    where,
    skip,
    take,
    orderBy: { created_at: 'desc' },
  });
};

exports.findById = async (id) => {
  return prisma.animal.findUnique({
    where: { id },
  });
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
