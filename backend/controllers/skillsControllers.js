const Skill = require('../models/skillModels');
const axios = require('axios');
const asyncHandler = require('express-async-handler');

// @desc    Get all registered skills
// @route   GET /api/skills/
// @access  Private/AdminLevelOne
const getAllSkills = asyncHandler(async (req, res) => {

    const pageSize = Number(req.query.pageSize);
    const page = Number(req.query.pageNumber) || 1; // by default on page 1

    const category = req.query.category ? {
        category: {
            $regex: req.query.category,
            $options: 'i'
        }
    } : {};

    const name = req.query.name ? {
        name: {
            $regex: req.query.name,
            $options: 'i'
        }
    } : {};  

    const count = await Skill.countDocuments({ ...category, ...name });

    const skills = await Skill.find({...category, ...name})
            .sort({'category': 1, 'name': 1})
            .limit(pageSize).skip(pageSize * (page - 1));

    if (skills) {
        res.status(200).json({ skills, page, pages: Math.ceil(count / pageSize), count });
    } else {
        res.status(400).json({ message: `No skills found` });
    }

});

// @desc    Delete a skill
// @route   DELETE /api/skills/:id
// @access  Private, AdminLevelZero
const deleteSkill = asyncHandler(async (req, res) => {

    const skill = await Skill.findById(req.params.skillId);

    if (skill) {
        await skill.remove()
        res.json({ message: 'Skill removed: ' + req.params.skillId });
    } else {
        res.status(404).json({message: 'Skill not found: ' + req.params.skillId});
        throw new Error('Skill not found: ' + req.params.skillId);
    }

});

module.exports = { getAllSkills, deleteSkill };