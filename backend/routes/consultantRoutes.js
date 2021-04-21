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
    getCDM,
    getAllLeaders,
    createOrUpdateConsultants,
    updateConsultantFromWavekeeper,
    uploadConsultantFileWk,
    updateCdmDelegation
} = require('../controllers/consultantControllers');

const router = express.Router();

router.get('/stream', function (req, res, next) {
  //when using text/plain it did not stream
  //without charset=utf-8, it only worked in Chrome, not Firefox
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');

  res.write("Thinking...\n");
  sendAndSleep(res, 1);
});


var sendAndSleep = function (response, counter) {
  if (counter > 10) {
    response.end();
  } else {
    response.write(" ;i=" + counter + '</br>');
    counter++;
    setTimeout(function () {
      sendAndSleep(response, counter);
    }, 1000)
  };
};
  

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
router.get('/leaderslist', protect, getAllLeaders);
router.get('/skills', protect, getAllSkills);
router.get('/staffings', protect, getConsultantStaffings);

router.get('/admin/consultants', protect, getAllConsultants);

router.put('/admin/mass-import', protect, createOrUpdateConsultants);
router.put('/admin/wk', protect, updateConsultantFromWavekeeper);
router.post('/upload', protect, uploadConsultantFileWk);

router.put('/delegate/:consultantId', protect, updateCdmDelegation);

router.route('/:consultantId')
    .get(protect, authorizeActionOnConsultant, getConsultant)
    .put(protect, authorizeActionOnConsultant, updateConsultant)
    .delete(protect, authorizeActionOnConsultant, deleteConsultant);

router.put('/comment/:consultantId', protect, authorizeActionOnConsultant, updateConsultantComment);

router.route('/')
    .get(protect, getMyConsultants)
    .post(protect, authorizeActionOnConsultant, createConsultant);
   
module.exports = router;