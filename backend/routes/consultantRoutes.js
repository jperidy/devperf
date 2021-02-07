const express = require('express');
const { protect, authorizeActionOnConsultant } = require('../middleware/authMiddleware');
const { 
    getMyConsultants, 
    getConsultant, 
    updateConsultant, 
    getConsultantSkills,
    createConsultant,
    getAllCDMData,
    getAllPracticesData,
    deleteConsultant,
    getAllConsultants,
    updateConsultantComment,
    getAllSkills,
    addConsultantSkill,
    deleteConsultantSkill,
    updateLevelConsultantSkill,
    getConsultantStaffings,
    getCDM
} = require('../controllers/consultantControllers');

const router = express.Router();

router.route('/')
    .get(protect, getMyConsultants)
    .post(protect, authorizeActionOnConsultant, createConsultant);

router.route('/cdm/:practice').get(protect, getAllCDMData);

router.route('/:consultantId/skill')
    .put(protect, authorizeActionOnConsultant, addConsultantSkill)
    .get(protect, getConsultantSkills);

router.route('/:consultantId/cdm')
    .get(protect, getCDM);

router.route('/:consultantId/skill/:skillId')
    .delete(protect, authorizeActionOnConsultant, deleteConsultantSkill)
    .put(protect, authorizeActionOnConsultant, updateLevelConsultantSkill);

    //delete('/:consultantId/skill/:skillId', protect, deleteConsultantSkill);
    
router.get('/practicelist', protect, getAllPracticesData);
router.get('/skills', protect, getAllSkills);
router.get('/staffings', protect, getConsultantStaffings);

router.get('/admin/consultants', protect, getAllConsultants);


router.route('/:consultantId')
    .get(protect, authorizeActionOnConsultant, getConsultant)
    .put(protect, authorizeActionOnConsultant, updateConsultant)
    .delete(protect, authorizeActionOnConsultant, deleteConsultant);

router.put('/comment/:consultantId', protect, authorizeActionOnConsultant, updateConsultantComment);
   
module.exports = router;