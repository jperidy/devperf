const Consultant = require("../models/consultantModel");
const Deal = require("../models/dealModel");
const mongoose = require("mongoose");

const myAccessDeals = async (data, req) => {
    //let dealsId = [];
    let myDeals = [];
    switch (data) {
        case 'my':
            myDeals = await Deal.find({
                $or:[
                    {'contacts.primary': req.user.consultantProfil._id},
                    {'contacts.secondary': req.user.consultantProfil._id}
                ]}).select('_id')
            break;
        case 'team':
            let myConsultants = await Consultant.find({cdmId: req.user.consultantProfil._id}).select('_id');
            myDeals = await Deal.find({
                $or:[
                    {'contacts.primary': req.user.consultantProfil._id},
                    {'contacts.secondary': req.user.consultantProfil._id},
                    {'staffingDecision.staff.idConsultant': {$in: myConsultants.map(x => x._id)}}
                ]}).select('_id')
            break;
        case 'department':
            myDeals = await Deal.find({
                $or:[
                    {'mainPractice': req.user.consultantProfil.practice},
                    {'othersPractices': req.user.consultantProfil.practice}
                ]}).select('_id')
            //dealsId = myDeals.map(x => x._id);
            break;
        case 'domain': // to implement
            myDeals = await Deal.find({
                $or: [
                    { 'mainPractice': req.user.consultantProfil.practice },
                    { 'othersPractices': req.user.consultantProfil.practice }
                ]
            }).select('contacts')
            //dealsId = myDeals.map(x => x._id);
            break;
        case 'all':
            myDeals = await Deal.find();
            //dealsId = myDeals.map(x => x._id);
            break;
        default:
            break;
    }
    return myDeals;
}

const calculatePriority = (deal) => {

    const REQUEST_STATUS = [
        {name: 'Identify Leader', staff: true, priority: 10},
        {name: 'Identify Staff', staff: true, priority: 7},
        {name: 'Staff to validate by leader', staff: false, priority: 5},
        {name: 'Staff validated by leader', staff: false, priority: 0},
        {name: 'Staff validated by client', staff: false, priority: 0},
        {name: 'You can staff elsewhere', staff: false, priority: 0},
        {name: 'Close', staff: false, priority: 0}
    ];

    const oneDay = 1000 * 3600 * 24;
    const deltaStart = Date.parse(new Date(deal.startDate)) - Date.now();

    const pDealStatus = [
        {name: 'Lead', priority: 0},
        {name: 'Proposal to send', priority: 5},
        {name: 'Proposal sent', priority: 5},
        {name: 'Won', priority: 10},
        {name: 'Abandoned', priority: 0},
    ];
    const pTypeBusiness = [
        {name: 'New business', priority: 10},
        {name: 'New position', priority: 5},
        {name: 'Replacement', priority: 1}
    ];
    const pRequestStatus = REQUEST_STATUS;

    const pDealProba = [
        {name: 10, priority: 1},
        {name: 30, priority: 3},
        {name: 50, priority: 5},
        {name: 70, priority: 7},
        {name: 100, priority: 10},
    ];

    const dealStatus = deal.status;
    const dealTypeBusiness = deal.type;
    const dealRequestStatus = deal.staffingRequest.requestStatus;
    const dealProbability = deal.probability;

    const dealStartDate = (deltaStart < oneDay) ? 10
        : deltaStart < (3 * oneDay) ? 7
        : deltaStart < (5 * oneDay) ? 5
        : deltaStart < (7 * oneDay) ? 3
        : deltaStart < (10 * oneDay) ? 1
        : 0
    //console.log(dealStartDate);
    // ajouter des pondérations si nécessaire plus tard
    const priority = 
        Number(pDealStatus.filter(x => x.name.toString() === dealStatus.toString())[0].priority)
        + Number(pTypeBusiness.filter(x => x.name.toString() === dealTypeBusiness.toString())[0].priority)
        + Number(pRequestStatus.filter(x => x.name.toString() === dealRequestStatus.toString())[0].priority)
        + Number(pDealProba.filter(x => x.name.toString() === dealProbability.toString())[0].priority)
        + Number(dealStartDate)
    
    //console.log(priority)
    return priority;
}


module.exports = { 
    myAccessDeals, 
    calculatePriority
}