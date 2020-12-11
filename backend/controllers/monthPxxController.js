const Month = require('../models/monthModel');
const asyncHandler = require('express-async-handler');
const Date = require('../utils/dateFunction');
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
    endSearch.addMonth(Number(numberOfMonths)-1);

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

    for (let currentDay = new Date(firstDay); currentDay < nextMonthDate; currentDay.setDate(currentDay.getDate() + 1)) {

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
    let month = new Month(monthToCreate);
    month = await month.save();

    return month;
};


module.exports = { getMonthPxxInfo, createMonth };