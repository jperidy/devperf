const Month = require('../models/monthModel');
const asyncHandler = require('express-async-handler');
//const Date = require('../utils/dateFunction');
const axios = require('axios');
const typeOfDay = require('../utils/typeOfDay');

// @desc    Get month configurations
// @route   GET /api/monthdata
// @access  Public
const getMonthPxxInfo = asyncHandler(async (req, res) => {

    const calculDayByType = (days, type) => {
        const nbDays = (days.map((day) => {
            if (day.type === type) {
                return 1;
            } else {
                return 0;
            }
        })).reduce((acc, item) => acc + item);
        return nbDays;
    };

    let searchDate = new Date(Number(req.query.searchdate));
    searchDate.setDate(0);
    let numberOfMonths = req.query.numberofmonths;
    let endSearch = new Date(Number(req.query.searchdate));
    endSearch.setMonth(endSearch.getMonth() + Number(numberOfMonths) - 1)
    //endSearch.addMonth(Number(numberOfMonths)-1);

    const monthPxxInfo = await Month.find({ "firstDay": { 
        $gt: searchDate.toISOString().substring(0, 10),
        $lt: endSearch.toISOString().substring(0, 10)
    }}).sort({ firstDay: 1});

    const monthInfoSynthese = monthPxxInfo.map(({ _id, name, days }) => {

        const workingday = calculDayByType(days, 'working-day');
        const nonWorkingDay = calculDayByType(days, 'non-working-day');
        const weekendDay = calculDayByType(days, 'week-end');

        return { _id, name, workingday, nonWorkingDay, weekendDay }

    });

    if (monthInfoSynthese) {
        res.status(200).json(monthInfoSynthese);
    } else {
        res.status(404);
        throw new Error('Month information not found');
    }
});

const createMonth = async (firstDay) => {

    const monthDate = new Date(firstDay);
    monthDate.setUTCHours(12);

    const nextMonthDate = new Date(firstDay);
    nextMonthDate.setUTCMonth(nextMonthDate.getUTCMonth() + 1);
    nextMonthDate.setUTCDate(1);
    nextMonthDate.setUTCHours(12);

    const monthToCreate = {
        name: monthDate.getUTCFullYear().toString() + '/' + Number(monthDate.getUTCMonth() + 1).toString(),
        firstDay: firstDay,
        days: []
    };

    // Collect all non-working-days from french government API
    const { data } = await axios.get(`https://calendrier.api.gouv.fr/jours-feries/metropole/${monthDate.getUTCFullYear().toString()}.json`);

    let currentDay = new Date(firstDay);
    currentDay.setUTCHours(12);

    for (currentDay; currentDay < nextMonthDate; currentDay.setUTCDate(currentDay.getUTCDate() + 1)) {
        //console.log('currentDay: ', currentDay, ' - nextMonthDate: ', nextMonthDate);

        const num = currentDay.toISOString().substring(0, 10);
        const typeDay = typeOfDay(currentDay.getUTCDay());
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
    let month = new Month(monthToCreate);
    month = await month.save();

    return month;
};


module.exports = { getMonthPxxInfo, createMonth };