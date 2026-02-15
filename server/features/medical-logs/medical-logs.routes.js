const router = require('express').Router();
const medicalLogController = require('./medical-logs.controller');

router.get('/', medicalLogController.getAllMedicalLogs);

module.exports = router;