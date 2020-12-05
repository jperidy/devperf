const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

// @desc    Get my consultant data
// @route   GET /api/consultants
// @access  Private
const getMyConsultants = asyncHandler(async (req, res) => {

    const myConsultants = await User.find({ cdmId: req.user._id })
                                                    .select('-password')
                                                    .sort({'name': 1});
    res.json(myConsultants);
    
});

// @desc    Get a consultant data by Id
// @route   GET /api/consultants/:consultantId
// @access  Private
const getConsultant = asyncHandler(async (req, res) => {

    const myConsultant = await User.findById(req.params.consultantId).select('-password');
    res.json(myConsultant);
    
});

module.exports = { getMyConsultants, getConsultant };