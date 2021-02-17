const asyncHandler = require('express-async-handler');
const Tace = require('../models/taceModel');

// @desc    Create a tace data of current month
// @route   POST /api/tace
// @access  Private
const createTaceData = asyncHandler(async(req,res) =>{

    const taceData = req.body;
    
    const existeData = await Tace.find({
        practice: taceData.practice,
        month: taceData.month
    });

    if (existeData.length === 0) {
        const newTaceData = await Tace.create(taceData);
        res.status(201).json(newTaceData);
    } else {
        existeData[0].bid = taceData.bid;
        existeData[0].target = taceData.target;
        await existeData[0].save();
        res.status(200).json(existeData[0])
    }

});

module.exports = { createTaceData };