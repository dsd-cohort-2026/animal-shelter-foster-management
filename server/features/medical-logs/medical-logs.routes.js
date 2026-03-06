const router = require('express').Router();
const authUserCheck = require('../../middleware/auth-user');
const validate = require('../../middleware/validator');
const getAllMedicalLogsSchema = require('../../validators/medical-logs/getMedicalLogs.validator');
const medicalLogController = require('./medical-logs.controller');

router.get('/', authUserCheck, validate(getAllMedicalLogsSchema), medicalLogController.getAllMedicalLogs);
router.get('/:id', medicalLogController.getMedicalLogById);

module.exports = router;
