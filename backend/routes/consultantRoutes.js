const express = require('express');
const { protect, admin, empowered } = require('../middleware/authMiddleware');
const { getMyConsultants, getConsultant } = require('../controllers/consultantControllers');

const router = express.Router();

router.get('/', protect, getMyConsultants);
router.get('/:consultantId', protect, empowered, getConsultant);

module.exports = router;