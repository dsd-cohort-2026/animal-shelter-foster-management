const medicalLogRepository = require('./medical-logs.repository');

exports.getAllMedicalLogs = async (user) => {
  const where = {};

  if (user.role === 'USER') {
    where.foster_user_id = user.id;
  }

  const medicalLogs = await medicalLogRepository.findAll(where);
  return medicalLogs.map(medicalLog => ({
    id: medicalLog.id,
    foster_user_id: medicalLog.foster_user_id,
    animal_id: medicalLog.animal_id,
    assignment_id: medicalLog.assignment_id,
    logged_at: medicalLog.logged_at,
    category: medicalLog.category,
    general_notes: medicalLog.general_notes,
    behavior_notes: medicalLog.behavior_notes,
    medication_id: medicalLog.medication_id,
    qty_administered: medicalLog.qty_administered,
    dose: medicalLog.dose,
    administered_at: medicalLog.administered_at,
    prescription: medicalLog.prescription,
    documents: medicalLog.documents
  }));
};

exports.getMedicalLogById = async (id) => {
  const medicalLog = await medicalLogRepository.findById(id);
  if (!medicalLog) {
    return null;
  }
  return {
    id: medicalLog.id,
    foster_user_id: medicalLog.foster_user_id,
    animal_id: medicalLog.animal_id,
    assignment_id: medicalLog.assignment_id,
    logged_at: medicalLog.logged_at,
    category: medicalLog.category,
    general_notes: medicalLog.general_notes,
    behavior_notes: medicalLog.behavior_notes,
    medication_id: medicalLog.medication_id,
    qty_administered: medicalLog.qty_administered,
    dose: medicalLog.dose,
    administered_at: medicalLog.administered_at,
    prescription: medicalLog.prescription,
    documents: medicalLog.documents
  };
};
