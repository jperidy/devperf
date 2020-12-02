const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const { getMyConsultants } = require('../controllers/consultantControllers');

const router = express.Router();

router.get('/', protect, getMyConsultants);

module.exports = router;