const medicalLogService = require('./medicalLogs.service');

exports.getAllMedicalLogs = async (req, res) => {
  try {
    const medicalLogs = await medicalLogService.getAllMedicalLogs();
    res.status(200).json(medicalLogs);
  } catch (error) {
    console.error("Error fetching medical logs:", error);
    res.status(500).json({ message: "An error occurred while fetching medical logs" });
  }   
}