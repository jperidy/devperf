const asyncHandler = require('express-async-handler');
const Access = require('../models/accessModel');

// @desc    get all the profil
// @route   GET /api/profil
// @access  Private
const getAllProfils = asyncHandler(async(req,res) =>{
    
    const level = req.user.profil.level;
    const profils = await Access.find({level:{$gte: level}});

    if(profils) {
        res.json(profils);
    } else {
        res.status(404);
        throw new Error('Profils not found');
    }
});

module.exports = {getAllProfils};