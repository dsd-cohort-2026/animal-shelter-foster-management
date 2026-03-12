const prisma = require('../../connections/prisma-client');

exports.findAll = async () => {
  return prisma.item.findMany({
    include: {
      medication: true,
    },
  });
};

exports.findUnique = async (id) => {
  return prisma.item.findUnique({
    where: { id },
    include: {
      medication: true,
    },
  });
};
