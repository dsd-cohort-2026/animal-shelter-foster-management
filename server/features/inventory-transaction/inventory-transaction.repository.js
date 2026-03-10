const prisma = require('../../connections/prisma-client');

exports.findAll = async (where = {}, skip = 0, take = 10) => {
  return await prisma.inventoryTransaction.findMany({
    where,
    skip,
    take,
    orderBy: { created_at: 'desc' },
    include: {
      item: true,
      foster_user: true,
    },
  });
};

exports.findById = async (id) => {
  return await prisma.inventoryTransaction.findUnique({ where: { id } });
};

exports.createIntakeTransaction = async (data) => {
  const {
    quantity,
    status,
    notes,
    staff_user_id,
    foster_user_id,
    item_id,
    item_name,
    item_category,
    item_species,
    item_unit,
    item_is_active,
    item_brand,
    item_description,
    item_food_life_stage,
    item_crate_size,
    item_crate_status,
    item_medication_dose,
    item_medication_side_effects,
    item_medication_administration_route,
    inventory_id,
    inventory_expiration_date,
  } = data;

  return await prisma.$transaction(async (tx) => {
    let resolvedItemId = item_id;
    if (!item_id) {
      const newItem = await tx.item.create({
        data: {
          name: item_name,
          category: item_category,
          species: item_species,
          unit: item_unit,
          is_active: item_is_active,
          brand: item_brand,
          description: item_description,
          ...(item_category === 'FOOD' && {
            food: { create: { life_stage: item_food_life_stage } },
          }),
          ...(item_category === 'CRATE' && {
            crate: { create: { size: item_crate_size, status: item_crate_status } },
          }),
          ...(item_category === 'MEDICINE' && {
            medication: {
              create: {
                recommended_dose: item_medication_dose,
                side_effects: item_medication_side_effects,
                administration_route: item_medication_administration_route,
              },
            },
          }),
        },
      });
      resolvedItemId = newItem.id;
    }

    let resolvedInventoryId = inventory_id;
    if (!inventory_id) {
      const newInventory = await tx.inventory.create({
        data: {
          quantity,
          expiration_date: inventory_expiration_date,
          item: { connect: { id: resolvedItemId } },
        },
      });
      resolvedInventoryId = newInventory.id;
    } else {
      await tx.inventory.update({
        where: { id: inventory_id },
        data: { quantity: { increment: quantity } },
      });
    }

    return await tx.inventoryTransaction.create({
      data: {
        quantity,
        status,
        type: 'INTAKE',
        notes,
        staff_user: { connect: { id: staff_user_id } },
        ...(foster_user_id && { foster_user: { connect: { id: foster_user_id } } }),
        item: { connect: { id: resolvedItemId } },
        inventory: { connect: { id: resolvedInventoryId } },
      },
    });
  });
};

exports.createDistributeTransaction = async ({
  quantity,
  type,
  status,
  notes,
  staff_user_id,
  foster_user_id,
  item_id,
}) => {
  return await prisma.$transaction(async (tx) => {
    const inventories = await tx.inventory.findMany({
      where: { item_id },
      orderBy: [{ expiration_date: { sort: 'asc', nulls: 'last' } }],
    });

    const totalAvailable = inventories.reduce((sum, inv) => sum + inv.quantity, 0);
    if (totalAvailable < quantity) {
      const err = new Error(
        `Insufficient inventory: ${quantity - totalAvailable} more units required than available`,
      );
      err.statusCode = 409;
      throw err;
    }

    let remaining = quantity;
    const transactions = [];

    for (const inv of inventories) {
      if (remaining <= 0) break;
      const deduct = Math.min(inv.quantity, remaining);
      await tx.inventory.update({
        where: { id: inv.id },
        data: { quantity: inv.quantity - deduct },
      });
      const txRecord = await tx.inventoryTransaction.create({
        data: {
          quantity: deduct,
          type,
          status,
          notes,
          item: { connect: { id: item_id } },
          inventory: { connect: { id: inv.id } },
          staff_user: { connect: { id: staff_user_id } },
          foster_user: { connect: { id: foster_user_id } },
        },
      });
      transactions.push(txRecord);
      remaining -= deduct;
    }
    console.log({ transactions });
    return transactions;
  });
};
