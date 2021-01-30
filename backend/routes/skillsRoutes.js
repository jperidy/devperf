const express = require('express');
const { getAllSkills, deleteSkill, createASkill } = require('../controllers/skillsControllers');
const router = express.Router();
const { protect, authorizeActionOnSkill } = require('../middleware/authMiddleware');

router.get('/', protect, getAllSkills)
router.post('/', protect, authorizeActionOnSkill, createASkill);

router.delete('/:skillId', protect, authorizeActionOnSkill, deleteSkill);

module.exports = router;