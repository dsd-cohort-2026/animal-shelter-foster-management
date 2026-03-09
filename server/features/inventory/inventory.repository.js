const prisma = require('../../connections/prisma-client');

exports.findAll = async () => {
  try {
    return await prisma.inventory.findMany({ include: { item: true } });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

exports.updateInventory = async ({ inventory, inventory_transactions }) => {
  try {
    const { id, ...inventoryData } = inventory;
    const updatedInventory = await prisma.inventory.update({
      where: { id },
      data: {
        ...inventoryData,
        ...(inventory_transactions && { inventory_transactions }),
      },
      include: { inventory_transactions: true },
    });
    return updatedInventory;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

exports.findById = async (id) => {
  try {
    return await prisma.inventory.findUnique({
      where: { id: id },
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};
