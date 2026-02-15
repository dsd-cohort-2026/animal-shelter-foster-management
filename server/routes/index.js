const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({ message: "Welcome to the Animal Shelter API" });
});

router.use('/animals', require('../features/animals/animals.routes'));
router.use('/medical-logs', require('../features/medical-logs/medical-logs.routes'));
router.use('/users', require('../features/users/users.routes'));


module.exports = router;
