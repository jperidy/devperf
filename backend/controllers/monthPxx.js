const monthPxx = require('../data/monthData');

exports.getMonthPxx = (req, res, next) => {
    res.status(200).json(monthPxx);
};