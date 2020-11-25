const Pxx = require('../models/pxxModel');
const asyncHandler = require('express-async-handler');

// @desc    Get pxx data
// @route   GET /api/pxx/:ids
// @access  Public
const getPxx = asyncHandler(async (req, res) => {

    const searchMonthQuery = req.params.ids
    const searchMonth = searchMonthQuery.split("_");

    const pxxData = await Pxx.find({ month: {$in: searchMonth} })
        .populate('month', 'name firstDay')
        .populate('name', 'name matricule arrival leaving')
        .sort({ name: 1, firstDay: 1 });

    if (pxxData) {
        res.status(200).json(pxxData);
    } else {
        res.status(404);
        throw new Error('Pxx information not found');
    }
});

module.exports = { getPxx };