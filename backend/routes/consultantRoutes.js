const express = require('express');
const { protect, empowered } = require('../middleware/authMiddleware');
const { 
    getMyConsultants, 
    getConsultant, 
    updateConsultant, 
    //getAllPracticeConsultants,
    createConsultant,
    getAllCDMData,
    getAllPracticesData,
    deleteConsultant,
    //getAllConsultantByPractice,
    getAllConsultants,
    updateConsultantComment,
    getAllSkills,
    addConsultantSkill,
    deleteConsultantSkill,
    updateLevelConsultantSkill,
    getConsultantStaffings
} = require('../controllers/consultantControllers');

const router = express.Router();

router.route('/')
    .get(protect, getMyConsultants)
    .post(protect, createConsultant);

router.route('/cdm/:practice').get(protect, getAllCDMData);

router.route('/:consultantId/skill')
    .put(protect, addConsultantSkill);

router.route('/:consultantId/skill/:skillId')
    .delete(protect, deleteConsultantSkill)
    .put(protect, updateLevelConsultantSkill);

    //delete('/:consultantId/skill/:skillId', protect, deleteConsultantSkill);
    
router.get('/practicelist', protect, getAllPracticesData);
router.get('/skills', protect, getAllSkills);
router.get('/staffings', protect, getConsultantStaffings);

router.get('/admin/consultants', protect, getAllConsultants);


router.route('/:consultantId')
    .get(protect, empowered, getConsultant)
    .put(protect, empowered, updateConsultant)
    .delete(protect, deleteConsultant);

router.put('/comment/:consultantId', protect, empowered, updateConsultantComment);
   
module.exports = router;