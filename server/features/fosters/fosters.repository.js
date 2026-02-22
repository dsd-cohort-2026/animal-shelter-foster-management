const prisma = require('../../connections/prisma-client');

exports.findAll = async () => {
  return await prisma.foster.findMany({
    orderBy: { created_at: 'desc' },
  });
};

exports.findById = async (id) => {
  return await prisma.foster.findUnique({
    where: { id },
  });
};

exports.create = async (data) => {
  return await prisma.foster.create({
    data,
  });
};

exports.update = async (id, data) => {
  return await prisma.foster.update({
    where: { id },
    data,
  });
};

exports.delete = async (id) => {
  return await prisma.foster.delete({
    where: { id },
  });
};

exports.findByAnimalId = async (animalId) => {
  return await prisma.foster.findMany({
    where: { animal_id: animalId },
    orderBy: { start_date: 'desc' },
  });
};

exports.findByUserId = async (userId) => {
  return await prisma.foster.findMany({
    where: { user_id: userId },
    orderBy: { start_date: 'desc' },
  });
};
