const prisma = require('../../connections/prisma-client');

exports.findAll = async (where = {}) => {
  return prisma.medicalLog.findMany({
    where,
  });
};

exports.findById = async (id) => {
  return prisma.medicalLog.findUnique({
    where: { id },
  });
};
