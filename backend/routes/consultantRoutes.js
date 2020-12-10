const express = require('express');
const { protect, admin, empowered } = require('../middleware/authMiddleware');
const { 
    getMyConsultants, 
    getConsultant, 
    updateConsultant, 
    getAllPracticeConsultants
} = require('../controllers/consultantControllers');

const router = express.Router();

router.get('/', protect, getMyConsultants);
router.get('/practice', protect, admin, getAllPracticeConsultants);
router.get('/:consultantId', protect, empowered, getConsultant);
router.put('/:consultantId', protect, empowered, updateConsultant);

module.exports = router;