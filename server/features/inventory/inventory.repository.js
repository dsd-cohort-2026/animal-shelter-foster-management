const prisma = require('../../connections/prisma-client');

exports.findAll = async () => {
  try {
    return await prisma.inventory.findMany({});
  } catch (err) {
    console.log(err);
    throw err;
  }
};

exports.updateInventory = async (inventoryAndTransaction) => {
  try {
    const { inventory, inventory_transactions } = inventoryAndTransaction;
    const updatedInventory = await prisma.inventory.update({
      where: { id: inventory.id },
      data: {
        quantity: inventory.quantity,
        item_id: inventory.item_id,
        expiration_date: inventory.expiration_date || null,
        inventory_transactions,
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
