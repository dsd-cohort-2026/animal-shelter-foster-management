const router = require('express').Router();
const medicalLogController = require('./medicalLogs.controller');

router.get('/', medicalLogController.getAllMedicalLogs);

module.exports = router;