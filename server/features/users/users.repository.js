const prisma = require('../../connections/prisma-client');

exports.findAll = async () => {
    return await prisma.user.findMany();
};

exports.findUnique = async (id) => {
  const users = await this.findAll();
  return users.find(user => user.id === parseInt(id));
};
