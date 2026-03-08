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

exports.unassignAnimal = async (req) => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const updatedAnimal = await tx.animal.update({
        where: { id: req.params.id },
        data: {
          foster_status: 'SHELTERED',
          modified_by: { create: { staff_user_id: req.body.assigned_by_staff } },
        },
      });
      const animalAssignment = await tx.animalAssignment.update({
        where: { id: req.body.assignment_id },
        data: { status: 'COMPLETE' },
        include: { animal: true },
      });
      return animalAssignment;
    });
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
exports.assignAnimal = async (idBodyAndRelations) => {
  try {
    const { body, relations, newStatus } = idBodyAndRelations;
    const result = await prisma.$transaction(async (tx) => {
      const updatedAnimal = await tx.animal.update({
        where: { id: relations.animal },
        data: {
          foster_status: newStatus,
          modified_by: { create: { staff_user_id: relations.assigned_by_staff } },
        },
      });
      const animalAssignment = await tx.animalAssignment.create({
        data: {
          ...body,
          animal: { connect: { id: relations.animal } },
          foster_user: { connect: { id: relations.foster_user } },
          assigned_by_staff: { connect: { id: relations.assigned_by_staff } },
        },
        include: { animal: true },
      });
      return animalAssignment;
    });
    return result;
  } catch(err){
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

exports.hardDelete = async (id) => {
  return prisma.animal.delete({
    where: { id },
  });
};
