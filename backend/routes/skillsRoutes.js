const express = require('express');
const { getAllSkills, deleteSkill, createASkill } = require('../controllers/skillsControllers');
const router = express.Router();
const { protect, adminLevelOne, adminLevelZero } = require('../middleware/authMiddleware');

router.get('/', protect, adminLevelOne, getAllSkills)
router.post('/', protect, adminLevelZero, createASkill);

router.delete('/:skillId', protect, adminLevelOne, deleteSkill);

module.exports = router;