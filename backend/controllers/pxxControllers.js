const Pxx = require('../models/pxxModel');
const Month = require('../models/monthModel');
const asyncHandler = require('express-async-handler');


// @desc    Get one pxx data
// @route   GET /api/pxx/consultantId/:id/month/:month
// @access  Private
const getPxx = asyncHandler(async (req, res) => {

    const consultantId = req.params.id;
    const date = req.params.month;
    //const { date, consultantId } = req.body;
    console.log('consultantId', consultantId);
    console.log('date', date);

    const firstDay = new Date(Number(date));
    firstDay.setDate(1);
    //console.log('startDate', startDate);

    const monthId = await Month.findOne({ firstDay: firstDay.toISOString().substring(0, 10)}).select('_id');
    //console.log('monthId', monthId);

    const pxxData = await Pxx.findOne({name: consultantId, month:monthId}).populate('month', 'name firstDay');
    if (pxxData) {
        res.status(200).json(pxxData);
    } else {
        res.status(404);
        throw new Error(`Pxx for for consultantID: ${consultantId} not found`);
    }

});

/*

// @desc    Get one pxx data from consultant id
// @route   GET /api/pxx/consultant/:id
// @access  Private
const getPxxFromConsultantId = asyncHandler(async (req, res) => {

    const consultantId = req.params.id;
    const { date, number } = req.body;
    //console.log(req.body);

    const startDate = new Date(date);
    startDate.setDate(0);
    //console.log(startDate);

    const endDate = new Date(date);
    endDate.setMonth(startDate.getMonth() + Number(number));
    //console.log(endDate);

    const monthId = await Month.find({ firstDay: { 
        $gt: startDate.toISOString().substring(0, 10),
        $lt: endDate.toISOString().substring(0, 10)
    }})
    .select('_id')
    .sort({name: 1});
    //console.log(monthId);

    const pxxData = await Pxx.find({name: consultantId, month:{$in: monthId} }).populate('month', 'name firstDay');
    if (pxxData) {
        res.status(200).json(pxxData);
    } else {
        res.status(404);
        throw new Error(`Pxx for for consultantID: ${consultantId} not found`);
    }

});

*/

/*
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

*/

module.exports = { getPxx };