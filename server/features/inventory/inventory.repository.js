const prisma = require('../../connections/prisma-client');

exports.findAll = async () => {
  const inventoryData = await prisma.inventory.findMany({
    include: { item: true },
  });
  return inventoryData;
};

exports.update = async (id, data) => {
  const index = inventoryData.findIndex((item) => item.id === id);
  if (index === -1) {
    return null;
  }
  const updatedRecord = {
    ...inventoryData[index],
    ...data,
  };
  inventoryData[index] = updatedRecord;
  return updatedRecord;
};

exports.findById = async (id) => {
  return inventoryData.find((item) => item.id === id);
};
