const Skill = require('../models/skillModels');
const Consultant = require('../models/consultantModel');
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

    const skill = await Skill.findById(req.params.skillId).select('_id');
    
    if (skill) {
        const impactedConsultants = await Consultant.find({'quality.skill': skill._id});
        //console.log('impactedConsultants', impactedConsultants.map(x => x.quality))
        for (let incr = 0; incr < impactedConsultants.length; incr++) {
            let impactedSkills = impactedConsultants[incr].quality;
            impactedSkills =  impactedSkills.filter(x => x.skill.toString() !== skill._id.toString());
            await Consultant.updateOne({_id: impactedConsultants[incr]._id}, {$set: {quality: impactedSkills}});
        }
        await skill.remove();
        res.json({ message: 'Skill removed: ' + req.params.skillId });
    } else {
        res.status(404).json({message: 'Skill not found: ' + req.params.skillId});
        throw new Error('Skill not found: ' + req.params.skillId);
    }

});

// @desc    Create a skill
// @route   POST /api/skills
// @access  Private, AdminLevelZero
const createASkill = asyncHandler(async (req, res) => {
    const skill = req.body;
    
    const verifySkill = await Skill.find({category: skill.category, name: skill.name});

    if (verifySkill.length === 0) {
        const createdSkill = await Skill.create(skill);
        res.status(201).json(createdSkill)
    } else {
        res.status(409).json({message: 'Skill already created, please verify'});
    }

});

module.exports = { getAllSkills, deleteSkill, createASkill };