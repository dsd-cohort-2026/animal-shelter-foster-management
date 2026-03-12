const prisma = require('../../connections/prisma-client');

exports.findAll = async (where = {}) => {
  return prisma.medicalLog.findMany({
    where,
    include: {
      medication: {
        include: {
          item: true,
        },
      },
    },
  });
};

exports.findById = async (id) => {
  return prisma.medicalLog.findUnique({
    where: { id },
    include: {
      medication: {
        include: {
          item: true,
        },
      },
    },
  });
};

exports.create = async (data) => {
  return prisma.medicalLog.create({
    data: {
      category: data.category,
      general_notes: data.general_notes,
      behavior_notes: data.behavior_notes,
      qty_administered: data.qty_administered,
      dose: data.dose,
      administered_at: data.administered_at,
      prescription: data.prescription,
      documents: data.documents,
      animal: { connect: { id: data.animal_id } },
      ...(data.foster_user_id && { foster_user: { connect: { id: data.foster_user_id } } }),
      ...(data.assignment_id && { assignment: { connect: { id: data.assignment_id } } }),
      ...(data.medication_id && { medication: { connect: { id: data.medication_id } } }),
    },
    include: {
      medication: {
        include: {
          item: true,
        },
      },
    },
  });
};

exports.findActiveAssignment = async (animalId, userId) => {
  return prisma.animalAssignment.findFirst({
    where: {
      animal_id: animalId,
      foster_user_id: userId,
      status: 'ACTIVE',
    },
  });
};
