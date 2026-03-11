const prisma = require('../../connections/prisma-client');

exports.findAll = async () => {
  return prisma.item.findMany({});
};

exports.findUnique = async (id) => {
  const items = await this.findAll();
  return items.find((item) => item.id === id);
};
