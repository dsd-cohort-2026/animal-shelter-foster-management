const prisma = require('../../connections/prisma-client');

exports.findAll = async () => {
  return await prisma.user.findMany();
};

exports.findById = async (id) => {
  try {
    return await prisma.user.findUnique({ where: { id } });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
