const Deal = require('../models/dealModel');
const asyncHandler = require('express-async-handler');

const createDeal = asyncHandler(async (req, res) => { 

    const deal = req.body;

    if (deal) {
        const newDeal = await Deal.create(deal);
        res.status(201).json(newDeal);
    } else {
        res.status(400).json({message: 'missing data to create a deal'});
    }
    
});

module.exports = { createDeal };