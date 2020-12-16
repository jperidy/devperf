const express = require('express');
const { protect, admin, empowered } = require('../middleware/authMiddleware');
const { 
    getMyConsultants, 
    getConsultant, 
    updateConsultant, 
    getAllPracticeConsultants,
    createConsultant,
    getAllCDMData,
    getAllPracticesData,
    deleteConsultant
} = require('../controllers/consultantControllers');

const router = express.Router();

router.route('/')
    .get(protect, getMyConsultants)
    .post(protect, admin, createConsultant);


router.route('/cdm/:practice').get(protect, getAllCDMData);

router.get('/practicelist', protect, getAllPracticesData);

router.get('/practice', protect, admin, getAllPracticeConsultants);

router.route('/:consultantId')
    .get(protect, empowered, getConsultant)
    .put(protect, empowered, updateConsultant)
    .delete(protect, admin, deleteConsultant);

   
module.exports = router;