const express = require('express');
const { protect, admin, empowered } = require('../middleware/authMiddleware');
const { 
    getMyConsultants, 
    getConsultant, 
    updateConsultant, 
    getAllPracticeConsultants,
    createConsultant
} = require('../controllers/consultantControllers');

const router = express.Router();

router.route('/')
    .get(protect, getMyConsultants)
    .post(protect, admin, createConsultant);

router.get('/practice', protect, admin, getAllPracticeConsultants);
router.get('/:consultantId', protect, empowered, getConsultant);
router.put('/:consultantId', protect, empowered, updateConsultant);

module.exports = router;