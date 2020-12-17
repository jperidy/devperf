const express = require('express');
const { protect, adminLevelOne, adminLevelZero, empowered } = require('../middleware/authMiddleware');
const { 
    getMyConsultants, 
    getConsultant, 
    updateConsultant, 
    getAllPracticeConsultants,
    createConsultant,
    getAllCDMData,
    getAllPracticesData,
    deleteConsultant,
    updateConsultantComment
} = require('../controllers/consultantControllers');

const router = express.Router();

router.route('/')
    .get(protect, getMyConsultants)
    .post(protect, adminLevelOne, createConsultant);


router.route('/cdm/:practice').get(protect, getAllCDMData);

router.get('/practicelist', protect, getAllPracticesData);

router.get('/practice', protect, adminLevelOne, getAllPracticeConsultants);

router.route('/:consultantId')
    .get(protect, empowered, getConsultant)
    .put(protect, empowered, updateConsultant)
    .delete(protect, adminLevelOne, deleteConsultant);

router.put('/comment/:consultantId', protect, empowered, updateConsultantComment);
   
module.exports = router;