const Pxx = require('../models/pxxModel');
const Month = require('../models/monthModel');
const Consultant = require('../models/consultantModel');
const Skill = require('../models/skillModels');
const axios = require('axios');
const asyncHandler = require('express-async-handler');
const Tace = require('../models/taceModel');
const path = require('path');
const XLSX = require('xlsx');
const fs = require('fs');
const { set } = require('mongoose');
//const readXlsxFile = require('read-excel-file/node');
//const calculDayByType = require('../utils/calculDayByType');
//const { createMonth } = require('./monthPxxController');
//const mongoose = require('mongoose');


const calculateAvailableDays = (userProfile, month) => {

    const arrival = userProfile.arrival && userProfile.arrival.toISOString().substring(0, 10);
    const leaving = userProfile.leaving && userProfile.leaving.toISOString().substring(0, 10);
    const isPartialTime = userProfile.isPartialTime.value
    const partiaTimeProfile = userProfile.isPartialTime.week;
    const startPartialTime = userProfile.isPartialTime.start;
    const endPartialTime = userProfile.isPartialTime.end;

    let availableDay = 0;

    for (let incrMonth = 0; incrMonth < month.days.length; incrMonth++) {

        if (month.days[incrMonth].num >= arrival && (!leaving || month.days[incrMonth].num <= leaving)) {

            if (month.days[incrMonth].type === "working-day") {

                if (isPartialTime) {
                    if (month.days[incrMonth].num >= startPartialTime && month.days[incrMonth].num <= endPartialTime) {
                        //console.log(new Date(month.days[incrMonth].num));
                        availableDay += Number(partiaTimeProfile.filter(x => Number(x.num) === Number((new Date(month.days[incrMonth].num)).getDay()))[0].worked)
                    } else {
                        availableDay += 1;
                    }
                } else {
                    availableDay += 1
                }
            }
        }
    }

    return availableDay;
}

const updatePartialTimePxx = async (consultantInfo, isPartialTime) => {
    //console.log('updatePartialTimePxx');

    const consultantId = consultantInfo._id;

    let firstDayPartial = new Date(isPartialTime.start);
    firstDayPartial = firstDayPartial.toISOString().substring(0, 10);
    let endDayPartial = new Date(isPartialTime.end);
    endDayPartial = endDayPartial.toISOString().substring(0, 10);

    const firstMonthDay = new Date(isPartialTime.start);
    firstMonthDay.setDate(0);
    const endDay = new Date(isPartialTime.end);

    const monthData = await Month.find({
        firstDay: {
            $gte: firstMonthDay.toISOString().substring(0, 10),
            $lte: endDay.toISOString().substring(0, 10)
        }
    });

    const monthId = monthData.map(x => x._id);
    //console.log('monthId', monthId);

    const pxxData = await Pxx.find({ month: { $in: monthId }, name: consultantId })
    //console.log('pxxData', pxxData);

    for (let incrPxx = 0; incrPxx < pxxData.length; incrPxx++) {
        const idMonth = pxxData[incrPxx].month;
        const monthInfo = monthData.filter(x => x._id.toString() === idMonth.toString())[0];
        //const daysInfo = monthInfo.days;
        let prodDay = 0;
        let notProdDay = 0;
        let leavingDay = 0;
        let availableDay = 0;

        // calculate all available days
        availableDay = calculateAvailableDays(consultantInfo, monthInfo);

        // recalculate leaving days
        const initialLeavingDay = pxxData[incrPxx].leavingDay;
        if (initialLeavingDay >= availableDay) {
            leavingDay = availableDay;
            availableDay = 0;
        } else {
            leavingDay = initialLeavingDay;
            availableDay -= leavingDay;
        }

        // reacalculate prod days
        const initialProdDay = pxxData[incrPxx].prodDay;
        if (initialProdDay >= availableDay) {
            prodDay = availableDay;
            availableDay = 0;
        } else {
            prodDay = initialProdDay;
            availableDay -= prodDay
        }

        // reacalculate not prod days
        const initialNotProdDay = pxxData[incrPxx].notProdDay;
        if (initialNotProdDay >= availableDay) {
            notProdDay = availableDay;
            availableDay = 0;
        } else {
            notProdDay = initialNotProdDay;
            availableDay -= notProdDay
        }


        pxxData[incrPxx].prodDay = prodDay;
        pxxData[incrPxx].notProdDay = notProdDay;
        pxxData[incrPxx].leavingDay = leavingDay;
        pxxData[incrPxx].availableDay = availableDay;

    }

    for (let incr = 0; incr < pxxData.length; incr++) {
        await pxxData[incr].save();
    }

}

const recalculatePxx = ({ initialProdDay, initialNotProdDay, initialLeavingDay, initialAvailableDay }) => {
    // recalculate available days
    //availableDay = workingDay;
    let prodDay = 0;
    let notProdDay = 0;
    let leavingDay = 0;
    let availableDay = initialAvailableDay

    // recalculate leaving days
    if (initialLeavingDay >= availableDay) {
        leavingDay = availableDay;
        availableDay = 0;
    } else {
        leavingDay = initialLeavingDay;
        availableDay -= leavingDay;
    }

    // reacalculate prod days
    if (initialProdDay >= availableDay) {
        prodDay = availableDay;
        availableDay = 0;
    } else {
        prodDay = initialProdDay;
        availableDay -= prodDay
    }

    // reacalculate not prod days
    if (initialNotProdDay >= availableDay) {
        notProdDay = availableDay;
        availableDay = 0;
    } else {
        notProdDay = initialNotProdDay;
        availableDay -= notProdDay
    }

    return { prodDay, notProdDay, leavingDay, availableDay }

}

const resetAllPxx = async (consultantInfo) => {

    const consultantId = consultantInfo._id;
    const pxxData = await Pxx.find({ name: consultantId });

    for (let incrPxx = 0; incrPxx < pxxData.length; incrPxx++) {
        const pxx = pxxData[incrPxx];
        const idMonth = pxx.month;
        const monthInfo = await Month.findById(idMonth);

        const initialAvailableDay = calculateAvailableDays(consultantInfo, monthInfo);
        const initialProdDay = Number(pxx.prodDay);
        const initialNotProdDay = Number(pxx.notProdDay);
        const initialLeavingDay = Number(pxx.leavingDay);

        const { prodDay, notProdDay, leavingDay, availableDay } = recalculatePxx({ initialProdDay, initialNotProdDay, initialLeavingDay, initialAvailableDay });

        pxxData[incrPxx].prodDay = prodDay;
        pxxData[incrPxx].notProdDay = notProdDay;
        pxxData[incrPxx].leavingDay = leavingDay;
        pxxData[incrPxx].availableDay = availableDay;
    }

    for (let incr = 0; incr < pxxData.length; incr++) {
        await pxxData[incr].save();
    }

}

const resetPartialTimePxx = async (consultantInfo) => {

    const consultantId = consultantInfo._id;
    const consultantToModify = await Consultant.findById(consultantId);
    const initialPartialTime = consultantToModify.isPartialTime;
    const firstMonthDay = new Date(initialPartialTime.start);
    firstMonthDay.setDate(0);
    const endMonthDay = new Date(initialPartialTime.end);


    const monthData = await Month.find({
        firstDay: {
            $gte: firstMonthDay.toISOString().substring(0, 10),
            $lte: endMonthDay.toISOString().substring(0, 10)
        }
    });

    const monthId = monthData.map(x => x._id);

    const pxxData = await Pxx.find({ month: { $in: monthId }, name: consultantId });

    for (let incrPxx = 0; incrPxx < pxxData.length; incrPxx++) {
        const pxx = pxxData[incrPxx];
        const idMonth = pxx.month;
        const monthInfo = monthData.filter(x => x._id.toString() === idMonth.toString())[0];

        const initialAvailableDay = calculateAvailableDays(consultantInfo, monthInfo);
        const initialProdDay = Number(pxx.prodDay);
        const initialNotProdDay = Number(pxx.notProdDay);
        const initialLeavingDay = Number(pxx.leavingDay);

        const { prodDay, notProdDay, leavingDay, availableDay } = recalculatePxx({ initialProdDay, initialNotProdDay, initialLeavingDay, initialAvailableDay });

        pxxData[incrPxx].prodDay = prodDay;
        pxxData[incrPxx].notProdDay = notProdDay;
        pxxData[incrPxx].leavingDay = leavingDay;
        pxxData[incrPxx].availableDay = availableDay;
    }

    for (let incr = 0; incr < pxxData.length; incr++) {
        await pxxData[incr].save();
    }
}

const createPxx = async (userProfile, month, tace = 0) => {

    let availableDay = calculateAvailableDays(userProfile, month);

    let prodDay = tace ? Math.abs(Math.round(((tace - 0.1) + Math.random() * 1) * availableDay)) : 0;
    prodDay = Math.min(prodDay, availableDay);

    const leavingDay = tace ? Math.round(Math.random() * (30 / 220) * (availableDay - prodDay)) : 0;

    const notProdDay = tace ? Math.round(Math.random() * (availableDay - prodDay - leavingDay)) : 0;

    availableDay = availableDay - (prodDay + notProdDay + leavingDay);

    const newPxx = new Pxx({
        name: userProfile._id,
        month: month._id,
        prodDay: prodDay,
        notProdDay: notProdDay,
        leavingDay: leavingDay,
        availableDay: availableDay
    });

    await newPxx.save(newPxx);

    return newPxx;
}

// @desc    Get pxx data
// @route   GET /api/edit?consultantId=${consultantId}&month=${month}&numberMonth=${numberOfMonth}
// @access  Private
const getPxx = asyncHandler(async (req, res) => {

    const consultantId = req.query.consultantId;
    const month = req.query.month;
    const numberOfMonth = Number(req.query.numberOfMonth);

    const lastMonth = new Date(month);
    lastMonth.setUTCMonth(lastMonth.getUTCMonth() + numberOfMonth - 1);
    lastMonth.setUTCDate(1);

    const pxxsData = [];

    for (let tampMonth = new Date(month); tampMonth <= new Date(lastMonth); tampMonth.setUTCMonth(tampMonth.getUTCMonth() + 1)) {
        tampMonth.setUTCDate(1);

        const firstDay = tampMonth.toISOString().substring(0, 10);
        const searchMonth = await Month.findOne({ firstDay: firstDay });
        if (searchMonth) {
            const pxxData = await Pxx.findOne({ name: consultantId, month: searchMonth._id }).populate('month', 'name firstDay');
            if (pxxData) {
                pxxsData.push(pxxData);
            } else {
                pxxsData.push({
                    _id: null,
                    month: searchMonth,
                    prodDay: '-',
                    notProdDay: '-',
                    leavingDay: '-',
                    availableDay: '-'
                })
            }
        } else {
            pxxsData.push({
                _id: null,
                month: null,
                prodDay: '-',
                notProdDay: '-',
                leavingDay: '-',
                availableDay: '-'
            })
        }
    }

    if (pxxsData.length) {
        res.status(200).json(pxxsData)
    } else {
        res.status(400).json({ message: `no pxx data found for consultant with id: ${consultantId} please check arrival date` })
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

// @desc    Get TACE data between start and end dates
// @route   GET /api/pxx/chart/tace?practice=practice&start=start&end=end
// @access  Private
const getProdChart = asyncHandler(async (req, res) => {

    const start = req.query.start; // '2021-01-01'
    const end = req.query.end; //'2021-03-01'
    const practice = req.query.practice; //'DET'

    const searchPractice = practice ? { practice: practice } : '';

    const month = await Month.find({firstDay: {$gte: start, $lte: end}});

    const consultantId = await Consultant.find({ ...searchPractice, grade: { $not: { $regex: 'Intern', $options: 'i' } } }).select('_id');

    const data = [];

    if (month) {
        for (let incr = 0; incr < month.length; incr++) {

            const sums = await Pxx.aggregate(
                [{
                    $match: {
                        'month': month[incr]._id,
                        'name': { $in: consultantId.map(x => x._id) }
                    }
                }, {
                    $group: {
                        _id: null,
                        sumProdDay: { $sum: "$prodDay" },
                        sumNotProdDay: { $sum: "$notProdDay" },
                        sumLeaving: { $sum: "$leavingDay" },
                        sumAvailableDay: { $sum: "$availableDay" },
                    }
                }]
            );

            let monthCalcule = {};

            if (sums) {
                const totalProdDay = sums[0].sumProdDay;
                const totalNotProdDay = sums[0].sumNotProdDay;
                const totalLeavingDay = sums[0].sumLeaving;
                const totalAvailableDay = sums[0].sumAvailableDay;

                const totalTACE = totalProdDay / (totalProdDay + totalNotProdDay + totalAvailableDay);
                const totalLeaving = totalLeavingDay / (totalProdDay + totalNotProdDay + totalAvailableDay);
                const workingDay = (month[incr].days.filter(x => x.type === 'working-day')).length;
                const totalETP = (totalAvailableDay + totalLeavingDay + totalNotProdDay + totalProdDay) / workingDay;

                monthCalcule = {
                    month: { firstDay: month[incr].firstDay, workingDay, _id: month[incr]._id },
                    totalProdDay,
                    totalNotProdDay,
                    totalLeavingDay,
                    totalAvailableDay,
                    totalTACE,
                    totalLeaving,
                    totalETP
                }
            } else {
                monthCalcule = {
                    totalProdDay: '0',
                    totalNotProdDay: '0',
                    totalLeavingDay: '0',
                    totalAvailableDay: '0',
                    totalTACE: '0',
                    totalLeaving: '0',
                    totalETP: '0'
                }
            };

            const dataTace = await Tace.find({ month: month[incr]._id, practice: practice });

            // add target and bid data registered
            if (dataTace.length === 1) {
                monthCalcule.target = dataTace[0].target,
                    monthCalcule.bid = dataTace[0].bid
            } else {
                monthCalcule.target = 0;
                monthCalcule.bid = 0;
            }

            data.push(monthCalcule);
        }
    }

    if (data) {
        res.status(200).json(data);
    } else {
        res.status(400).json({ message: 'not data found' });
    }
})

// @desc    Get Availability data between start and end dates
// @route   GET /api/pxx/chart/availability?practice=practice&start=start&end=end
// @access  Private
const getAvailabilityChart = asyncHandler(async (req, res) => {

    const start = req.query.start; // '2021-01-01'
    const end = req.query.end; //'2021-03-01'

    const searchPractice = req.query.practice ?
        req.query.practice === 'all' ? {} : { practice: req.query.practice }
        : {}

    let experience = req.query.experience ?
        {
            valued: {
                $gte: req.query.experience.split('-').length > 1 ? new Date(Date.now() - (1000 * 3600 * 24 * 365.25 * Number(req.query.experience.split('-')[1]))) : 0,
                $lte: new Date(Date.now() - (1000 * 3600 * 24 * 365.25 * Number(req.query.experience.split('-')[0])))
            }
        } : {};

    let skills = req.query.skills ?
        {
            name: {
                $regex: req.query.skills.replace(' ', '').split(';').join('|'),
                $options: 'i'
            }
        } : '';


    //console.log('experience: ', experience);
    let searchSkillsId = (skills !== '') ? await Skill.find(skills).select('_id') : '';
    //searchSkillsId = (searchSkillsId !== '') ? {'quality.skill': {$in: searchSkillsId}} : {};
    searchSkillsId = (searchSkillsId !== '') ? { $and: searchSkillsId.map(skill => ({ 'quality.skill': skill })) } : {};
    //console.log(searchSkillsId)

    //const searchPractice = practice ? {practice: practice} : {};

    const consultantId = await Consultant.find({ ...searchPractice, ...searchSkillsId, ...experience }).select('_id');

    const month = await Month.find({ firstDay: { $gte: start, $lte: end } }).sort({ 'name': 1 }).select('_id name firstDay');
    const data = [];

    //const searchAvailableDay = req.query.filterMode === 'all' ? { $eq: 0 } : { $gt: 0 }
    const searchAvailableDay = req.query.filterMode === 'notAvailable' ? 
        { availableDay: { $eq: 0 } } 
        : req.query.filterMode === 'notProd' ?
        { notProdDay: { $gt: 0 } }
        : { availableDay: { $gt: 0 } }

    const availablePxx = await Pxx.find({
        month: { $in: month.map(x => x._id) },
        name: { $in: consultantId.map(x => x._id) },
        ...searchAvailableDay
        //availableDay: searchAvailableDay
    }).populate('month name').sort({ availableDay: -1 });

    //.select('_id name email grade valued practice quality availableDay comment')

    const allSkills = await Skill.find();

    if (availablePxx) {
        for (let incr = 0; incr < month.length; incr++) {
            let pxxLines = availablePxx.filter(x => x.month.name === month[incr].name);
            pxxLines = pxxLines.map(x => {
                const qualities = x.name.quality.map(quality => {
                    const filteredSkill = allSkills.filter(skill => skill._id.toString() === quality.skill.toString())
                    if (filteredSkill) {
                        return {
                            skill: filteredSkill[0].name,
                            level: quality.level
                        }
                    }
                })

                return {
                    _id: x.name._id,
                    name: x.name.name,
                    email: x.name.email,
                    grade: x.name.grade,
                    valued: x.name.valued,
                    practice: x.name.practice,
                    quality: qualities,
                    availableDay: x.availableDay,
                    comment: x.name.comment,
                    availabilityComment: x.name.availabilityComment,
                    notProdComment: x.name.notProdComment,
                    linkedCV: x.name.linkedCV
                }
            });
            const result = {
                month: { firstDay: month[incr].firstDay, _id: month[incr]._id },
                availabilities: pxxLines
            }

            data.push(result);
        }
    }
    //console.log(Date(Date.now()) + ' >> fin boucle 3 mois');


    if (data) {
        res.status(200).json(data);
    } else {
        res.status(400).json({ message: 'no data found' });
    }
});

// @desc    Get All pxx data for spectific month
// @route   GET /api/pxx?practice=practice&month=month&keywork=keywork&pagesize=pagesize&pageNumber=pageNumber
// @access  Private
const getAllPxx = asyncHandler(async (req, res) => {

    const pageSize = Number(req.query.pageSize);
    const page = Number(req.query.pageNumber) || 1; // by default on page 1
    const practice = req.query.practice;
    const month = req.query.month;
    const keyword = req.query.keyword ? {
        name: {
            $regex: req.query.keyword,
            $options: 'i'
        }
    } : {};

    const consultants = await Consultant.find({ ...keyword, practice: practice }).select('_id');
    const consultantsId = consultants.map(consultant => consultant._id);

    const count = await Pxx.countDocuments({ month: month, name: { $in: consultantsId } });
    let pxxs = await Pxx.find({ month: month, name: { $in: consultantsId } })
        .populate('name month')
        .sort({ 'name': 1 })
        .limit(pageSize).skip(pageSize * (page - 1));

    if (pxxs) {
        for (let incr = 0; incr < pxxs.length; incr++) {
            const cdm = await Consultant.findById(pxxs[incr].name.cdmId).select('_id name matricule');
            pxxs[incr].name.cdmId = cdm;
            //console.log(cdm);
        }
        res.status(200).json({ pxxs, page, pages: Math.ceil(count / pageSize), count });
    } else {
        res.status(400).json({ message: 'no pxx found' });
    }
});

/* // @desc    Mass import of pxx datas
// @route   PUT /api/pxx/admin/mass-import
// @access  Private
const massImportPxx = asyncHandler(async (req, res) => {

    const access = req.user.profil.api.filter(x => x.name === 'massImportPxx')[0].data;
    const errors = [];

    if (access === 'yes') {

        const pxxData = req.body;
        for (let page = 0; page < pxxData.length ; page++) {
            const pxxPage = pxxData[page];
            for (let pxxLine = 0 ; pxxLine < pxxPage.length; pxxLine++){

                let matricule = pxxPage[pxxLine].MATRICULE.toString().padStart(9,0)
                let monthName = pxxPage[pxxLine].MONTH
                //monthName = '20' + monthName.split('/')[1] + '/' + Number(monthName.split('/')[0])
                //console.log(monthName);

                const month = await Month.findOne({name: monthName});
                if (!month) {
                    console.log('Month not found: ' + monthName);
                    errors.push({monthName, matricule});
                    break;
                }

                const consultant = await Consultant.findOne({matricule: matricule});
                if (!consultant) {
                    console.log('Consultant not found: ' + matricule);
                    errors.push({monthName, matricule});
                    break
                }

                const existPxxLine = await Pxx.findOne({name: consultant._id, month: month._id});

                if (existPxxLine) {

                    let availableDay = calculateAvailableDays(consultant, month);

                    existPxxLine.prodDay = Math.min(Number(pxxPage[pxxLine].PROD), availableDay);
                    availableDay = availableDay - existPxxLine.prodDay;

                    existPxxLine.notProdDay = Math.min(Number(pxxPage[pxxLine].NOT_PROD), availableDay);
                    availableDay = availableDay - existPxxLine.notProdDay;

                    existPxxLine.leavingDay = Math.min(Number(pxxPage[pxxLine].HOLIDAYS), availableDay);
                    availableDay = availableDay - existPxxLine.leavingDay;
                    
                    //existPxxLine.availableDay = Math.min(Number(pxxPage[pxxLine].AVAILABLE), availableDay);
                    existPxxLine.availableDay = availableDay;
                    availableDay = availableDay - existPxxLine.availableDay;

                    if (availableDay === 0) {
                        await existPxxLine.save();
                    } else {
                        console.log(`Error when updating pxx: ${consultant.name}`);
                        errors.push({monthName, matricule, message: 'Total days recalculated not equal to available days in the month'})
                    }

                } else {
                    console.log('Pxx not found for month.name: ' + monthName + ' and consultant.matricule: ' + matricule);
                    errors.push({monthName, matricule, message: 'Pxx not found'});
                }
            }
        }

    }
    if (errors.length === 0){
        res.status(200).json({message: 'All pxx updated'});
    } else {
        res.status(200).json({message: 'Errors updating Pxx', datas:errors});
    }
    
}); */

// @desc    Mass import of pxx datas
// @route   PUT /api/pxx/admin/mass-import
// @access  Private
const lineImportPxx = asyncHandler(async (req, res) => {

    const access = req.user.profil.api.filter(x => x.name === 'massImportPxx')[0].data;
    //const errors = [];

    if (access === 'yes') {

        const pxxLine = req.body;

        let matricule = pxxLine.MATRICULE.toString().padStart(9, 0);
        let monthName = pxxLine.MONTH;

        const month = await Month.findOne({ name: monthName });
        if (!month) {
            console.log('Month not found: ' + monthName);
            //errors.push({ monthName, matricule });
            //res.status(404).json({notUpdatedMatricule: matricule, message: 'Month not found: ' + monthName});
            res.status(404).json({ message: { matricule: matricule, display: 'Month not found: ' + monthName } });
            return;
            //break;
        }

        const consultant = await Consultant.findOne({ matricule: matricule });
        if (!consultant) {
            console.log('Consultant not found: ' + matricule);
            //errors.push({ monthName, matricule });
            res.status(404).json({ message: { matricule: matricule, display: 'Consultant not found: ' + matricule } });
            return;
            //break
        }

        const existPxxLine = await Pxx.findOne({ name: consultant._id, month: month._id });

        if (existPxxLine) {

            let availableDay = calculateAvailableDays(consultant, month);

            existPxxLine.prodDay = Math.min(Number(pxxLine.PROD), availableDay);
            availableDay = availableDay - existPxxLine.prodDay;

            existPxxLine.notProdDay = Math.min(Number(pxxLine.NOT_PROD), availableDay);
            availableDay = availableDay - existPxxLine.notProdDay;

            existPxxLine.leavingDay = Math.min(Number(pxxLine.HOLIDAYS), availableDay);
            availableDay = availableDay - existPxxLine.leavingDay;

            //existPxxLine.availableDay = Math.min(Number(pxxLine.AVAILABLE), availableDay);
            existPxxLine.availableDay = availableDay;
            availableDay = availableDay - existPxxLine.availableDay;

            if (availableDay === 0) {
                const updatedPxx = await existPxxLine.save();
                res.status(200).json({ updatedMatricule: matricule });
            } else {
                console.log(`Error when updating pxx: ${consultant.name}`);
                res.status(500).json({ message: { matricule: matricule, display: `Total days recalculated not equal to available days in the month ${monthName} for: ${consultant.name}` } })
                //errors.push({ monthName, matricule, message: 'Total days recalculated not equal to available days in the month' })
            }

        } else {
            console.log('Pxx not found for month.name: ' + monthName + ' and consultant.matricule: ' + matricule);
            res.status(404).json({ notUpdatedMatricule: matricule, message: `Pxx not found for month ${monthName} and matricule: ${matricule}` });
            //errors.push({ monthName, matricule, message: 'Pxx not found' });
        }

    }
    /*
    if (errors.length === 0) {
        res.status(200).json({ message: 'All pxx updated' });
    } else {
        res.status(200).json({ message: 'Errors updating Pxx', datas: errors });
    }
    */

});

const transformMonth = (pxxFormat) => {
    const convertToArray = pxxFormat.split('/');
    return '20' + convertToArray[1] + '/' + Number(convertToArray[0]);
}

const updatePxxLine = async (pxxLine, consultantId) => {
    const monthId = await Month.findOne({ name: pxxLine.month }).select('_id');
    if (!monthId) {
        return {
            result: false,
            message: `Error - Month not found for: ${pxxLine.month} if format is different from YYYY/MM please contact your admin\n`
        };
    }

    const pxxToUpdate = await Pxx.findOne({ name: consultantId._id, month: monthId._id });
    if (pxxToUpdate) {
        pxxToUpdate.prodDay = pxxLine.prod;
        pxxToUpdate.notProdDay = pxxLine.notProd;
        pxxToUpdate.leavingDay = pxxLine.holidays;
        pxxToUpdate.availableDay = pxxLine.available;
        pxxToUpdate.save();
        return {
            result: true,
            message: `[info] PxxLine updated for: ${pxxLine.name} and ${pxxLine.month}`
        };
    } else {
        //console.log(`PxxLine not found for: ${pxxLine.name} and ${pxxLine.month}`);
        return {
            result: false,
            message: `[error] PxxLine not found for: ${pxxLine.name} and ${pxxLine.month} (${monthId._id}) please verify start and leave dates`
        }
    }
}


// @desc    Mass import of pxx datas from Pxx directory
// @route   PUT /api/pxx/admin/line-import-wk
// @access  Private
const updatePxxFromPxx = asyncHandler(async (req, res) => {

    console.log('start');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.write("Start...\n");

    let numberOfPxx = 0;
    let numberOfConsultants = 0;
    let numberUpdated = 0;
    let numberErrors = 0;
    const matriculeScanned = []
    //const messagesSynthese = [];


    const startName = req.body.path;
    console.log(startName);
    const directory = path.resolve() + '/uploads/pxx';

    try {

        // stamps to avoid to proceed too much request
        // const practice = req.user.consultantProfil.practice;
        // const consultantsAllPractice = await Consultant.find({ practice: practice });
        const practices = [];
        const consultantsAllPractice = await Consultant.find();

        //console.log(practice);
        //console.log(consultantsAllPractice);

        const files = fs.readdirSync(directory);
        numberOfPxx = files.length;

        for (let incr = 0; incr < files.length; incr++) {
            const file = files[incr];
            const regex = `^${startName}-p[A-Za-z]+-[0-9]{2}.xlsb|^${startName}-p[A-Za-z]+-arrivees.xlsb`

            if (file.match(regex)) {

                res.write(`\n----------------> Start updating ${file} \n`);
                console.log(`----------------> Start updating ${file}`);

                wb = XLSX.readFile(directory + '/' + file);
                const firstSheetName = wb.SheetNames[0];
                const firstWorkSheet = wb.Sheets[firstSheetName];
                const firstWorkSheetCSV = XLSX.utils.sheet_to_csv(firstWorkSheet);
                const firstSheetAllLines = firstWorkSheetCSV.split(/\r\n|\n/);

                const readablePxx = []
                for (let incr = 0; incr < Math.min(150, firstSheetAllLines.length); incr++) {
                    const line = firstSheetAllLines[incr].split((','));
                    readablePxx.push(line);
                }

                const monthToUpdate = [
                    transformMonth(readablePxx[5][9]),
                    transformMonth(readablePxx[5][13]),
                    transformMonth(readablePxx[5][17]),
                    transformMonth(readablePxx[5][21]),
                    transformMonth(readablePxx[5][25]),
                ];
                
                for (let line = 8; line < Math.min(150, readablePxx.length); line++) {

                    const pxxLine = readablePxx[line];
                    if (Number(pxxLine[0]) > 0 && Number(pxxLine[0]) <= 1) {

                        const consultantProfil = consultantsAllPractice.filter( x => x.matricule === pxxLine[4].toString().padStart(9, 0))[0];
                        
                        if (!consultantProfil) {

                            const messageProfil = `[error] Consultant not found for: ${pxxLine[3]} (${pxxLine[4].toString().padStart(9, 0)}) it could be due to:
                            \t- wrong matricule reference
                            \t- wrong start and leave dates`;
                            numberErrors += 1;
                            console.error(messageProfil);
                            res.write(messageProfil + '\n');

                        } else {

                            practices.push(consultantProfil.practice);
                            numberOfConsultants += 1;
                            const resultConsultant = [];

                            const firstMonth = {
                                month: monthToUpdate[0],
                                name: pxxLine[3],
                                matricule: pxxLine[4].toString().padStart(9, 0),
                                prod: Number(pxxLine[9]),
                                notProd: Number(pxxLine[10]),
                                holidays: Number(pxxLine[11]),
                                available: Number(pxxLine[12]),
                            }
                            let result = await updatePxxLine(firstMonth, consultantProfil);
                            console.log(result.message);
                            resultConsultant.push(result);

                            const secondMonth = {
                                month: monthToUpdate[1],
                                name: pxxLine[3],
                                matricule: pxxLine[4].toString().padStart(9, 0),
                                prod: Number(pxxLine[13]),
                                notProd: Number(pxxLine[14]),
                                holidays: Number(pxxLine[15]),
                                available: Number(pxxLine[16]),
                            }
                            result = await updatePxxLine(secondMonth, consultantProfil);
                            console.log(result.message);
                            resultConsultant.push(result);

                            const thirdMonth = {
                                month: monthToUpdate[2],
                                name: pxxLine[3],
                                matricule: pxxLine[4].toString().padStart(9, 0),
                                prod: Number(pxxLine[17]),
                                notProd: Number(pxxLine[18]),
                                holidays: Number(pxxLine[19]),
                                available: Number(pxxLine[20]),
                            }
                            result = await updatePxxLine(thirdMonth, consultantProfil);
                            console.log(result.message);
                            resultConsultant.push(result);

                            const fourthMonth = {
                                month: monthToUpdate[3],
                                name: pxxLine[3],
                                matricule: pxxLine[4].toString().padStart(9, 0),
                                prod: Number(pxxLine[21]),
                                notProd: Number(pxxLine[22]),
                                holidays: Number(pxxLine[23]),
                                available: Number(pxxLine[24]),
                            }
                            result = await updatePxxLine(fourthMonth, consultantProfil);
                            console.log(result.message);
                            resultConsultant.push(result);

                            const fifthMonth = {
                                month: monthToUpdate[4],
                                name: pxxLine[3],
                                matricule: pxxLine[4].toString().padStart(9, 0),
                                prod: Number(pxxLine[25]),
                                notProd: Number(pxxLine[26]),
                                holidays: Number(pxxLine[27]),
                                available: Number(pxxLine[28]),
                            }
                            result = await updatePxxLine(fifthMonth, consultantProfil);
                            console.log(result.message);
                            resultConsultant.push(result);

                            const comments = `${pxxLine[33]}\n\nDominante :\n${pxxLine[30]}\n\nExpertises :\n${pxxLine[31]}`

                            consultantProfil.comment = comments;
                            const updatedProfil = await consultantProfil.save();
                            if (!updatedProfil) {
                                console.log(`[error] updating comment for consultant: ${consultantProfil.name}`);
                                res.write(`[error] updating comment for consultant: ${consultantProfil.name}\n`);
                                numberErrors += 1;
                            }

                            if (resultConsultant.map(x => x.result).includes(false)) {
                                const lineWithErrors = resultConsultant.filter(x => x.result === false);
                                console.log(`[error] Updating Pxx Line - ${pxxLine[3]} (${pxxLine[4]})`);
                                res.write(`[error] Updating Pxx Line - ${pxxLine[3]} (${pxxLine[4]})\n`);
                                numberErrors += 1;

                                lineWithErrors.map(x => {
                                    res.write(`\t${x.message}\n`);
                                    console.log(`\t${x.message}`);
                                });

                            } else {
                                numberUpdated += 1;
                            }
                            matriculeScanned.push(pxxLine[4].toString().padStart(9, 0));
                        }
                    }
                }
            } else {
                res.write(`[error] pxx format not matching with patern: ${file}\n\n`);
                console.log(`[error] pxx format not matching with patern: ${file}\n\n`);
            }
        }

        // add fucntion to verify if missing Pxx
        const usersPractices = Array(...new Set(practices));
        const startMonth = new Date(Date.now());
        startMonth.setUTCDate(1);

        const endMonth = new Date(Date.now());
        endMonth.setUTCMonth(endMonth.getUTCMonth() + 1);
        endMonth.setUTCDate(0);

        const allConsultantsActivesInDatabase = await Consultant.find({
            $or: [
                { practice: {$in: usersPractices}, arrival: { $lte: startMonth }, leaving: { $gte: endMonth } },
                { practice: {$in: usersPractices}, arrival: { $lte: startMonth }, leaving: null }
            ]
        }).select('matricule name');

        for (let incrMatricule = 0; incrMatricule < allConsultantsActivesInDatabase.length; incrMatricule++) {
            let currentMatricule = allConsultantsActivesInDatabase[incrMatricule].matricule;
            let currentName = allConsultantsActivesInDatabase[incrMatricule].name;

            if (!matriculeScanned.includes(currentMatricule)) {
                const warningMsg = `Warning - it seems ${currentName} (${currentMatricule}) is not present in Pxx files
                \tsolution 1 : maybe this consultant left > please enter leave date in consultant profile
                \tsolution 2 : maybe it is not still filled in CDM Pxx > please add the line\n`

                res.write(warningMsg);
            }
        }

        // cleaning repository
        fs.readdir(directory, (err, files) => {
            if (err) {
                return console.log('Unable to scan directory: ' + err);
            }
            files.map(file => {

                fs.unlink(directory + '/' + file, (err) => {
                    if (err) {
                        console.error('[error] removing file ' + file + 'from ' + directory);
                    } else {
                        console.log(file + ' has been removed from: ' + directory);
                    }
                });
            })
        })

    } catch (error) {
        console.log('Unable to scan directory: ' + error);
    }

    //res.write(`------ SYNTHESE\n\n`);
    //res.write(messagesSynthese.join(''));
    res.write(`\n------ END UPDATE: ${numberOfConsultants} consultants updated from ${numberOfPxx} Pxx with ${numberErrors} errors and ${numberUpdated} success`);
    res.end();

});

module.exports = {
    getPxx,
    getAllPxx,
    updatePxx,
    calculateAvailableDays,
    resetAllPxx,
    resetPartialTimePxx,
    updatePartialTimePxx,
    getProdChart,
    getAvailabilityChart,
    createPxx,
    lineImportPxx,
    updatePxxFromPxx
};