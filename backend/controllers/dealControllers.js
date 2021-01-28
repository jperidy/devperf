const Deal = require('../models/dealModel');
const asyncHandler = require('express-async-handler');
const { myAccessDeals,calculatePriority } = require('../utils/dealsFunctions');

// @desc    Create a Deal 
// @route   POST /api/deals
// @access  Private/AdminLevelOne
const createDeal = asyncHandler(async (req, res) => { 

    const deal = req.body;

    const priority = calculatePriority(deal);
    deal.priority = priority;

    if (deal) {
        const newDeal = await Deal.create(deal);
        res.status(201).json(newDeal);
    } else {
        res.status(400).json({message: 'missing data to create a deal'});
    } 
});

// @desc    Update a Deal 
// @route   PUT /api/deals/:id
// @access  Private/AdminLevelOne
const updateADeal = asyncHandler(async (req, res) => { 

    const dealId = req.params.id;
    const deal = await Deal.findById(dealId);

    
    if (deal) {
        
        deal.company = req.body.company;
        deal.client = req.body.client;
        deal.title = req.body.title;
        deal.type = req.body.type;
        deal.contacts = req.body.contacts;
        deal.status = req.body.status;
        deal.probability = req.body.probability;
        deal.description = req.body.description;
        deal.proposalDate = req.body.proposalDate;
        deal.presentationDate = req.body.presentationDate;
        deal.wonDate = req.body.wonDate;
        deal.startDate = req.body.startDate;
        deal.mainPractice = req.body.mainPractice;
        deal.othersPractices = req.body.othersPractices;
        deal.location = req.body.location;
        deal.staffingRequest.instructions = req.body.staffingRequest.instructions;
        deal.staffingRequest.requestStatus = req.body.staffingRequest.requestStatus;
        deal.staffingRequest.ressources = req.body.staffingRequest.ressources;
        deal.staffingDecision.instructions = req.body.staffingDecision.instructions;
        deal.staffingDecision.staffingStatus = req.body.staffingDecision.staffingStatus;
        deal.staffingDecision.staff = req.body.staffingDecision.staff;
        deal.comments = req.body.comments;

        const priority = calculatePriority(deal);
        deal.priority = priority;
        
        await deal.save();
        res.status(200).json({message: 'Deal updated'});

    } else {
        res.status(400).json({ message: "Can't update not registered deal" });
    }
    
});

// @desc    Get the list of Deals in a Practice
// @route   GET /api/deals
// @access  Private/AdminLevelOne
const getAllDeals = asyncHandler(async (req, res) => {

    const access = req.user.profil.api.filter(x => x.name === 'getAllDeals')[0].data;
    const dealsId = await myAccessDeals(access, req);
    //console.log(dealsId);
    
    const pageSize = Number(req.query.pageSize) || 10000; // by default a lot
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

    let globalFilter = {};
    
    if (req.query.globalFilter) {

        const currentDate = new Date(Date.now());
    
        const lastWeekDate = new Date(Date.now());
        lastWeekDate.setUTCDate(lastWeekDate.getUTCDate() - 7);
    
        const lastMonthDate = new Date(Date.now());
        lastMonthDate.setUTCMonth(lastMonthDate.getUTCMonth() - 1);

        switch (req.query.globalFilter) {
            case 'updatedDeal':
                globalFilter = {
                    updatedAt: { $gte: lastWeekDate }
                };
                break;
            case 'notUpdatedDeal':
                globalFilter = {
                    updatedAt: { $lte: lastMonthDate }
                };
                break;
            case 'newDealWeek':
                globalFilter = {
                    createdAt: { $gte: lastWeekDate }
                };
                break;
            case 'newDealMonth':
                globalFilter = {
                    createdAt: { $gte: lastMonthDate }
                };
                break;
            case 'wonWeek':
                globalFilter = {
                    wonDate: { $gte: lastWeekDate }
                };
                break;
            case 'wonMonth':
                globalFilter = {
                    wonDate: { $gte: lastMonthDate }
                };
                break;
            default:
                globalFilter = {};
        }
    }

    //console.log(globalFilter);

    const count = await Deal.countDocuments({ 
        ...searchClient,
        //...searchMainPractice,
        //...searchOthersPractices,
        /* ...{$or:[
            searchMainPractice,
            searchOthersPractices
        ]}, */
        ...searchCompany,
        ...searchTitle,
        ...searchStatus,
        ...searchRequest,
        ...globalFilter,
        _id: {$in: dealsId}
    });

    const deals = await Deal.find({ 
        ...searchClient,
        //...searchMainPractice,
        //...searchOthersPractices,
        /* ...{$or:[
            searchMainPractice,
            searchOthersPractices
        ]}, */
        ...searchCompany,
        ...searchTitle,
        ...searchStatus,
        ...searchRequest,
        ...globalFilter,
        _id: {$in: dealsId}
    }).populate('contacts.primary contacts.secondary')
        .sort({'priority': -1})
        .limit(pageSize).skip(pageSize * (page - 1));

    if (deals) {
        res.status(200).json({deals, page, pages: Math.ceil(count/pageSize), count});
    } else {
        res.status(400).json({message: `No consultants found for practice: ${practice}` });
    }

});

// @desc    Delete a Deal 
// @route   DELETE /api/deals?id=id
// @access  Private/AdminLevelOne
const deleteDeal = asyncHandler(async (req, res) => { 

    const id = req.query.id;
    const deal = await Deal.findById(id);

    if(deal) {
        await deal.remove();
        res.status(200).json({message: "deal deleted"});
    } else {
        res.status(404).json({message: "deal to delete not found"});
    }
    
});

// @desc    Get a Deal 
// @route   GET /api/deals/:id
// @access  Private/AdminLevelOne
const getADeal = asyncHandler(async (req, res) => { 

    const id = req.params.id;
    const deal = await Deal.findById(id).populate('staffingDecision.staff.idConsultant contacts.primary contacts.secondary');

    if(deal) {
        res.status(200).json(deal);
    } else {
        res.status(404).json({message: "deal not found"});
    }
    
});

module.exports = { createDeal, getAllDeals, deleteDeal, getADeal, updateADeal };