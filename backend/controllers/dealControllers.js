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

// @desc    Get the list of Deals in a Practice
// @route   GET /api/deals
// @access  Private/AdminLevelOne
const getAllDeals = asyncHandler(async (req, res) => {
    
    const pageSize = Number(req.query.pageSize);
    const page = Number(req.query.pageNumber) || 1; // by default on page 1
    
    const searchTitle = req.query.title ? {
        title: {
            $regex: req.query.title,
            $options: 'i'
        }
    } : {};
    const searchClient = req.query.client ? {
        client: {
            $regex: req.query.client,
            $options: 'i'
        }
    } : {};
    const searchCompany = req.query.company ? {
        company: {
            $regex: req.query.company,
            $options: 'i'
        }
    } : {};
    const searchStatus = req.query.status ? {
        status: {
            $regex: req.query.status,
            $options: 'i'
        }
    } : {};
    const searchRequest = req.query.request ? {
        'staffingRequest.requestStatus': {
            $regex: req.query.request,
            $options: 'i'
        }
    } : {};

    const searchMainPractice = req.query.mainPractice ? {
        mainPractice: {
            $regex: req.query.mainPractice,
            $options: 'i'
        }
    } : {};
    
    const searchOthersPractices = req.query.othersPractices ? {
        othersPractices: {
            $regex: req.query.othersPractices,
            $options: 'i'
        }
    } : {};

    const count = await Deal.countDocuments({ 
        ...searchClient,
        ...searchMainPractice,
        ...searchOthersPractices,
        ...searchCompany,
        ...searchTitle,
        ...searchStatus,
        ...searchRequest 
    });

    const deals = await Deal.find({ 
        ...searchClient,
        ...searchMainPractice,
        ...searchOthersPractices,
        ...searchCompany,
        ...searchTitle,
        ...searchStatus,
        ...searchRequest 
    }).sort({'name': 1})
        .limit(pageSize).skip(pageSize * (page - 1));

    if (deals) {
        res.status(200).json({deals, page, pages: Math.ceil(count/pageSize), count});
    } else {
        res.status(400).json({message: `No consultants found for practice: ${practice}` });
    }

});

module.exports = { createDeal, getAllDeals };