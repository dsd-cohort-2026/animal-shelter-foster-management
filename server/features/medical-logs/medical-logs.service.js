const medicalLogRepository = require('./medical-logs.repository');

exports.getAllMedicalLogs = async () => {
  const medicalLogs = await medicalLogRepository.findAll();
  return medicalLogs.map(medicalLog => ({
    id: medicalLog.id,
    foster_user_id: medicalLog.foster_user_id,
    animal_id: medicalLog.animal_id,
    assignment_id: medicalLog.assignment_id,
    logged_at: medicalLog.logged_at, 
    category: medicalLog.category, 
    general_notes: medicalLog.general_notes, 
    behavior_notes: medicalLog.behavior_notes, 
    medicine_id: medicalLog.medicine_id, 
    qty_administered: medicalLog.qty_administered, 
    dose: medicalLog.dose, 
    administered_at: medicalLog.administered_at, 
    prescription: medicalLog.prescription, 
    documents: medicalLog.documents
  }));
};