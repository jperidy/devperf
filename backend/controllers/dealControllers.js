const Deal = require('../models/dealModel');
const asyncHandler = require('express-async-handler');
const { myAccessDeals, calculatePriority } = require('../utils/dealsFunctions');
const Consultant = require('../models/consultantModel');
//const { sendAMail } = require('../config/email');
//const MailService = require("../config/MailService");

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
        deal.duration = req.body.duration;
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
        deal.othersContacts = req.body.othersContacts;

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

    //console.log('start getAll', new Date(Date.now()).toISOString())

    let access = req.user.profil.api.filter(x => x.name === 'getAllDeals')[0].data;
    if (req.query.filterMy === 'true') {
        access = 'team'
    }

    const dealsId = await myAccessDeals(access, req);
    
    const pageSize = Number(req.query.pageSize) || 10000; // by default a lot
    const page = Number(req.query.pageNumber) || 1; // by default on page 1
    
    const searchTitle = req.query.title ? {
        title: {
            $regex: req.query.title,
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

    let searchRequest = {};

    if (req.query.state === 'active') {
        if (req.query.request) {
            searchRequest = {
                $and: [
                    { 'staffingRequest.requestStatus': { $regex: req.query.request, $options: 'i' } },
                    { 'staffingRequest.requestStatus': { $ne: 'Close' } }
                ]
            }
        } else {
            searchRequest = { 'staffingRequest.requestStatus': { $ne: 'Close' }}
        }
    } else {
        if (req.query.request) {
            searchRequest = {'staffingRequest.requestStatus': { $regex: req.query.request, $options: 'i'} }
        }
    }


    let searchContact = {};
    if(req.query.contact) {
        const contactsId = await Consultant.find({name: {$regex: req.query.contact, $options: 'i'}})
        searchContact = {
            $or: [
                { 'contacts.primary': {$in: contactsId} },
                { 'contacts.secondary': {$in: contactsId} }
            ]
        }
    }

    let searchStaff = {};
    if(req.query.staff) {
        const staffId = await Consultant.find({name: {$regex: req.query.staff, $options: 'i'}})
        searchStaff = {
            'staffingDecision.staff.idConsultant': {$in: staffId}    
        }
    }
    
    const deals = await Deal.find({ 
        ...searchContact,
        ...searchCompany,
        ...searchTitle,
        ...searchStatus,
        ...searchRequest,
        ...searchStaff,
        _id: {$in: dealsId}
    }).populate({path: 'contacts.primary contacts.secondary', select: 'name matricule practice'})
        .populate({path: 'staffingDecision.staff.idConsultant', select: 'name matricule practice'})
        .sort({'priority': -1})
        .limit(pageSize).skip(pageSize * (page - 1));
    
    const count = deals.length;

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

    //const id = req.query.id;
    const id = req.params.id;
    const deal = await Deal.findById(id);

    if(deal) {
        await deal.remove();
        res.status(200).json({message: "deal deleted"});
    } else {
        res.status(404).json({message: "deal to delete not found"});
    }
    
});

// @desc    Get old deals for consultant 
// @route   GET /api/deals/old?consultantId=consultantId
// @access  Private/AdminLevelOne
const getOldDeals = asyncHandler(async (req, res) => { 

    const consultantId = req.query.consultantId;
    // take this constant from frontend/constants/dealConstants.js
    const DEAL_STATUS = [
        {name: 'Lead', priority: 0, display: 'onTrack'},
        {name: 'Proposal to send', priority: 5, display: 'onTrack'},
        {name: 'Proposal sent', priority: 5, display: 'onTrack'},
        {name: 'Won', priority: 10, display: 'win'},
        {name: 'Abandoned', priority: 0, display: 'lost'},
        {name: 'Lost', priority: 0, display: 'lots'},
    ];
    
    const oldDeals = await Deal.find({'staffingDecision.staff.idConsultant':consultantId, status:DEAL_STATUS.filter(x=>x.display==='win').map(x=>x.name)});

    if(oldDeals) {
        res.status(200).json(oldDeals);
    } else {
        res.status(404).json({message: "No old deals found"});
    }
    
});

// @desc    Get a Deal 
// @route   GET /api/deals/:id
// @access  Private
const getADeal = asyncHandler(async (req, res) => { 

    const id = req.params.id;
    const deal = await Deal.findById(id).populate('staffingDecision.staff.idConsultant contacts.primary contacts.secondary');

    if(deal) {
        res.status(200).json(deal);
    } else {
        res.status(404).json({message: "deal not found"});
    }
    
});


module.exports = { createDeal, getAllDeals, deleteDeal, getADeal, updateADeal, getOldDeals };