const asyncHandler = require('express-async-handler');
const Access = require('../models/accessModel');

// @desc    get all the profil
// @route   GET /api/profil
// @access  Private
const getAllProfils = asyncHandler(async(req,res) =>{
    
    const level = req.user.profil.level;
    //console.log(req.user.profil.level);
    const profils = await Access.find({level:{$gte: level}});

    if(profils) {
        res.status(200).json(profils);
    } else {
        res.status(404);
        throw new Error('Profils not found');
    }
});

// @desc    update a profil
// @route   PUT /api/profil
// @access  Private
const updateProfil = asyncHandler(async(req,res) =>{
    
    const data = req.body;
    //console.log(data)

    const profilToUpdate = await Access.findById(data.profilId);

    if (profilToUpdate) {
        for (let incr=0 ; incr < profilToUpdate.frontAccess.length ; incr++) {
            if(profilToUpdate.frontAccess[incr].id === data.id) {
                profilToUpdate.frontAccess[incr].label = data.label;
                profilToUpdate.frontAccess[incr].mode = data.mode;
                profilToUpdate.frontAccess[incr].data = data.data;
            }
        }
        await profilToUpdate.save();
        res.status(200).json({message: `profil ${data._id} updated`});
    } else {
        res.status(404).json({message: `Profil ${data._id} not found`})
    }

});

module.exports = {getAllProfils, updateProfil};