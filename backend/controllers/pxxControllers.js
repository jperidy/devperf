const Pxx = require('../models/pxxModel');
const Month = require('../models/monthModel');
const User = require('../models/userModel');
const axios = require('axios');
const asyncHandler = require('express-async-handler');
const calculDayByType = require('../utils/calculDayByType')
const typeOfDay = require('../utils/typeOfDay');


// @desc    Get one pxx data
// @route   GET /api/pxx/consultantId/:id/month/:month
// @access  Private
const getPxx = asyncHandler(async (req, res) => {

    const consultantId = req.params.id;
    const date = req.params.month;
    const firstDay = date;

    let month = await Month.findOne({ firstDay: firstDay }).select('_id days');

    if (!month) {

        const monthDate = new Date(firstDay);
        const nextMonthDate = new Date(firstDay);
        nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
        nextMonthDate.setDate(1);

        const monthToCreate = {
            name: monthDate.getFullYear().toString() + '/' + Number(monthDate.getMonth() + 1).toString(),
            firstDay: firstDay,
            days: []
        };

        // Collect all non-working-days from french government API
        const { data } = await axios.get(`https://calendrier.api.gouv.fr/jours-feries/metropole/${monthDate.getFullYear().toString()}.json`);

        for (let currentDay = new Date(firstDay); currentDay < nextMonthDate; currentDay.setDate(currentDay.getDate()+1)) {

            const num = currentDay.toISOString().substring(0, 10);
            const typeDay = typeOfDay(currentDay.getDay());
            const isNonWorkingDay = data[num];
            let type = '';
            if (isNonWorkingDay && (typeDay === "working-day")) {
                type = 'non-working-day';
            } else {
                type = typeDay;
            }
            monthToCreate.days.push({
                num: num,
                type: type
            })
        }
        month = new Month(monthToCreate);
        month = await month.save();
    }

    const pxxData = await Pxx.findOne({ name: consultantId, month: month._id }).populate('month', 'name firstDay');

    if (pxxData) {
        res.status(200).json(pxxData);
    } else {

        const userProfile = await User.findById(consultantId);
        
        let availableDay = 0;
        // Apply partial time profil to consultant
        if (userProfile.isPartialTime.value === true) {

            const partiaTimeProfile = userProfile.isPartialTime.week;
            const startPartialTime = userProfile.isPartialTime.start;
            const endPartialTime = userProfile.isPartialTime.end;

            for (let incrMonth = 0; incrMonth < month.days.length; incrMonth++) {
                if (month.days[incrMonth].type === "working-day"){
                    if (month.days[incrMonth].num >= startPartialTime && month.days[incrMonth].num <= endPartialTime) {
                        availableDay += Number(partiaTimeProfile.filter(x => Number(x.num) === Number((new Date(month.days[incrMonth].num)).getDay()))[0].worked)
                    } else {
                        availableDay+=1;
                    }
                }
            }

        } else {
            availableDay = calculDayByType(month.days, "working-day")
        }

        const newPxx = new Pxx({
            name: consultantId,
            month: month._id,
            prodDay: 0,
            notProdDay: 0,
            leavingDay: 0,
            availableDay: availableDay
        });

        await newPxx.save(newPxx);
        
        const pxxCreated = await Pxx.findOne({ name: consultantId, month: month._id }).populate('month', 'name firstDay');
        res.status(200).json(pxxCreated);
    }
});

// @desc    Update pxx data
// @route   PUT /api/pxx/
// @access  Private
const updatePxx = asyncHandler(async (req, res) => {

    const pxx = await Pxx.findById(req.body._id);

    if (pxx) {
        pxx.prodDay = req.body.prodDay;
        pxx.notProdDay = req.body.notProdDay;
        pxx.leavingDay = req.body.leavingDay;
        pxx.availableDay = req.body.availableDay;
        const updatePxx = await pxx.save();
        res.status(200).json(updatePxx);
    } else {
        res.status(404).json({ message: 'Pxx not found. Please try later' });
        throw new Error('Pxx not found. Please try later');
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

module.exports = { getPxx, updatePxx };