const express = require('express');
const { protect, admin, empowered } = require('../middleware/authMiddleware');
const { 
    getMyConsultants, 
    getConsultant, 
    updateConsultant, 
    getAllPracticeConsultants,
    createConsultant,
    getAllCDMData
} = require('../controllers/consultantControllers');

const router = express.Router();

router.route('/')
    .get(protect, getMyConsultants)
    .post(protect, admin, createConsultant);

router.route('/cdm/:practice').get(protect, admin, getAllCDMData);

router.get('/practice', protect, admin, getAllPracticeConsultants);

router.route('/:consultantId')
    .get(protect, empowered, getConsultant)
    .put(protect, empowered, updateConsultant);

   
module.exports = router;