const Month = require('../models/monthModel');
const asyncHandler = require('express-async-handler');
const Date = require('../utils/dateFunction');

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

module.exports = { getMonthPxxInfo };