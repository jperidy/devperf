const Pxx = require('../models/pxxModel');
const Month = require('../models/monthModel');
const Consultant = require('../models/consultantModel');
const Skill = require('../models/skillModels');
const axios = require('axios');
const asyncHandler = require('express-async-handler');
const calculDayByType = require('../utils/calculDayByType');
const { createMonth } = require('./monthPxxController');
const mongoose = require('mongoose');


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
    firstDayPartial = firstDayPartial.toISOString().substring(0,10);
    let endDayPartial = new Date(isPartialTime.end);
    endDayPartial = endDayPartial.toISOString().substring(0,10);

    const firstMonthDay = new Date(isPartialTime.start);
    firstMonthDay.setDate(0);
    const endDay = new Date(isPartialTime.end);

    const monthData = await Month.find({
        firstDay: {
            $gte: firstMonthDay.toISOString().substring(0,10),
            $lte: endDay.toISOString().substring(0,10)
        }
    });
    
    const monthId = monthData.map( x => x._id);
    //console.log('monthId', monthId);

    const pxxData = await Pxx.find({ month: {$in: monthId}, name: consultantId})
    //console.log('pxxData', pxxData);

    for (let incrPxx = 0; incrPxx < pxxData.length; incrPxx++) {
        const idMonth = pxxData[incrPxx].month;
        const monthInfo = monthData.filter( x => x._id.toString() === idMonth.toString())[0];
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
        if(initialProdDay >= availableDay) {
            prodDay = availableDay;
            availableDay = 0;
        } else {
            prodDay = initialProdDay;
            availableDay -= prodDay
        }

        // reacalculate not prod days
        const initialNotProdDay = pxxData[incrPxx].notProdDay;
        if(initialNotProdDay >= availableDay) {
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

    for (let incr = 0 ; incr < pxxData.length ; incr++) {
        pxxData[incr].save();
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
    //console.log('resetAllPxx');

    const consultantId = consultantInfo._id;
    const pxxData = await Pxx.find({name: consultantId });

    //let availableDay = 0;

    for (let incrPxx = 0; incrPxx < pxxData.length; incrPxx++) {
        const pxx = pxxData[incrPxx];
        const idMonth = pxx.month;
        const monthInfo = await Month.findById(idMonth);
        //const monthInfo = monthData.filter(x => x._id.toString() === idMonth.toString())[0];
        
        const initialAvailableDay = calculateAvailableDays(consultantInfo, monthInfo);
        const initialProdDay = Number(pxx.prodDay);
        const initialNotProdDay = Number(pxx.notProdDay);
        const initialLeavingDay = Number(pxx.leavingDay);

        const { prodDay, notProdDay, leavingDay, availableDay } = recalculatePxx({initialProdDay, initialNotProdDay, initialLeavingDay, initialAvailableDay});

        //console.log('init: ', initialProdDay, initialNotProdDay, initialLeavingDay, initialAvailableDay);
        //console.log('calculate: ', prodDay, notProdDay, leavingDay, availableDay);

        pxxData[incrPxx].prodDay = prodDay;
        pxxData[incrPxx].notProdDay = notProdDay;
        pxxData[incrPxx].leavingDay = leavingDay;
        pxxData[incrPxx].availableDay = availableDay;
    }

    for (let incr = 0; incr < pxxData.length; incr++) {
        pxxData[incr].save();
    }

}

const resetPartialTimePxx = async (consultantInfo) => {
    //console.log('resetPartialTimePxx');

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

    //let availableDay = 0;

    for (let incrPxx = 0; incrPxx < pxxData.length; incrPxx++) {
        const pxx = pxxData[incrPxx];
        const idMonth = pxx.month;
        const monthInfo = monthData.filter(x => x._id.toString() === idMonth.toString())[0];
        
        const initialAvailableDay = calculateAvailableDays(consultantInfo, monthInfo);
        const initialProdDay = Number(pxx.prodDay);
        const initialNotProdDay = Number(pxx.notProdDay);
        const initialLeavingDay = Number(pxx.leavingDay);

        const { prodDay, notProdDay, leavingDay, availableDay } = recalculatePxx({initialProdDay, initialNotProdDay, initialLeavingDay, initialAvailableDay});

        pxxData[incrPxx].prodDay = prodDay;
        pxxData[incrPxx].notProdDay = notProdDay;
        pxxData[incrPxx].leavingDay = leavingDay;
        pxxData[incrPxx].availableDay = availableDay;
    }

    for (let incr = 0; incr < pxxData.length; incr++) {
        pxxData[incr].save();
    }
}

const createPxx = async (userProfile, month, tace = 0) => {

    let availableDay = calculateAvailableDays(userProfile, month );
    //const workingDay = (month.days.filter(x => x.type === 'working-day')).length;
    const prodDay = tace ? Math.round((tace + 0.05 * Math.random()) * availableDay) : 0;
    const leavingDay = tace ? Math.round(Math.random() * (30/220) * (availableDay)) : 0;
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
    //console.log(`${new Date(Date.now()).toISOString()} Pxx created for: ${userProfile.name} and monthId: ${month._id}`);

    return newPxx;
}

// @desc    Get pxx data
// @route   GET /api/edit?consultantId=${consultantId}&month=${month}&numberMonth=${numberOfMonth}
// @access  Private
const getPxx = asyncHandler(async (req, res) => {

    /*
    const consultantId = req.params.id;
    const date = req.params.month;
    const firstDay = date;
    */

    const consultantId = req.query.consultantId;
    const month = req.query.month;
    const numberOfMonth = Number(req.query.numberOfMonth);

    const lastMonth = new Date(month);
    lastMonth.setUTCMonth(lastMonth.getUTCMonth() + numberOfMonth - 1);
    lastMonth.setUTCDate(1);

    const pxxsData = [];

    for (let tampMonth = new Date(month) ; tampMonth <= new Date(lastMonth) ; tampMonth.setUTCMonth(tampMonth.getUTCMonth() +1)) {
        tampMonth.setUTCDate(1);
        //console.log(month, lastMonth, tampMonth);

        const firstDay = tampMonth.toISOString().substring(0,10);
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
        res.status(400).json({ message: `no pxx data found for consultant with id: ${consultantId} please check arrival date`})
    }

    /*
    // Collect month information
    let month = await Month.findOne({ firstDay: firstDay }).select('_id days');
    */

    /////////////////////////////////////////////////////////////////////////////// ADD in Cron tab
    /*
    if (!month) {
        month = await createMonth(firstDay);
    }
    
    // Collect user information
    const userProfile = await Consultant.findById(consultantId);
    // Collect or create pxx
    const pxxData = await Pxx.findOne({ name: consultantId, month: month._id }).populate('month', 'name firstDay');    
    if (pxxData) {
        res.status(200).json(pxxData);
 
    } else {
        await createPxx(userProfile, month);
        const pxxCreated = await Pxx.findOne({ name: consultantId, month: month._id }).populate('month', 'name firstDay');
        res.status(200).json(pxxCreated);
    }

    */

    /*
    if (month) {
        const pxxData = await Pxx.findOne({ name: consultantId, month: month._id }).populate('month', 'name firstDay');
        if (pxxData) {
            res.status(200).json(pxxData);
        } else {
            res.status(400).json({message: `no pxx data found for consultant: ${consultantId} and month: ${firstDay}`});
        }
    } else {
        res.status(400).json({message: `month not yet created: ${firstDay}` });
    }
    */
    
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

    //console.log(req.query);
    const start = req.query.start; // '2021-01-01'
    const end = req.query.end; //'2021-03-01'
    const practice = req.query.practice; //'DET'

    const searchPractice = practice ? {practice: practice} : '';

    const month = await Month.find({ 
        firstDay: {
            $gte: start,
            $lte: end
    }});

    const consultantId = await Consultant.find({...searchPractice, grade: { $not: { $regex: 'Intern', $options: 'i' }}}).select('_id');   

    const data = [];

    if (month) {
        for (let incr = 0; incr < month.length; incr++) {

            const sums = await Pxx.aggregate(
                [{
                    $match: {
                        'month': month[incr]._id,
                        'name': {$in: consultantId.map(x => x._id)}
                    }
                },{
                    $group: {
                        _id: null,
                        sumProdDay: {$sum: "$prodDay"},
                        sumNotProdDay: {$sum: "$notProdDay"},
                        sumLeaving: {$sum: "$leavingDay"},
                        sumAvailableDay: {$sum: "$availableDay"},
                    }
                }]
            );
            
            const totalProdDay = sums[0].sumProdDay;
            const totalNotProdDay = sums[0].sumNotProdDay;
            const totalLeavingDay = sums[0].sumLeaving;
            const totalAvailableDay = sums[0].sumAvailableDay;
            
            const totalTACE = totalProdDay / (totalProdDay + totalNotProdDay + totalAvailableDay);
            const totalLeaving = totalLeavingDay / (totalProdDay + totalNotProdDay + totalAvailableDay);
            const workingDay = (month[incr].days.filter(x => x.type === 'working-day')).length;
            const totalETP = (totalAvailableDay + totalLeavingDay + totalNotProdDay + totalProdDay) / workingDay;

            //console.log(totalProdDay, totalNotProdDay, totalLeaving, totalAvailableDay, totalTACE)
    
            const monthCalcule = {
                month: {firstDay: month[incr].firstDay, workingDay, _id: month[incr]._id},
                totalProdDay,
                totalNotProdDay,
                totalLeavingDay,
                totalAvailableDay,
                totalTACE,
                totalLeaving,
                totalETP
            }
    
            data.push(monthCalcule);
        }
    }

    if (data) {
        res.status(200).json(data);
    } else {
        res.status(400).json({message: 'not data found'});
    }
})

// @desc    Get Availability data between start and end dates
// @route   GET /api/pxx/chart/availability?practice=practice&start=start&end=end
// @access  Private
const getAvailabilityChart = asyncHandler(async (req, res) => {

    const start = req.query.start; // '2021-01-01'
    const end = req.query.end; //'2021-03-01'
    const practice = req.query.practice; //'DET'
    
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
    searchSkillsId = (searchSkillsId !== '') ? {'quality.skill': {$in: searchSkillsId}} : {};
    const searchPractice = practice ? {practice: practice} : {};

    const consultantId = await Consultant.find({...searchPractice, ...searchSkillsId, ...experience}).select('_id');
    
    const month = await Month.find({firstDay: { $gte: start, $lte: end }});
    const data = [];
    if (month) {
        for (let incr = 0; incr < month.length; incr++) {

            const pxxMonth = await Pxx.find({
                'month': month[incr]._id,
                'name': {$in: consultantId}
            }).populate('month name').sort({availableDay: -1});
            
            let pxxAvailable = pxxMonth.filter(x => x.availableDay > 0);
            pxxAvailable = pxxAvailable.map(x => ({
                _id: x.name._id,
                name: x.name.name,
                email: x.name.email,
                grade: x.name.grade,
                valued: x.name.valued,
                practice: x.name.practice,
                quality: x.name.quality,
                availableDay: x.availableDay,
                comment: x.name.comment
            }))
            //console.log('pxxAvailable', pxxAvailable)
    
            const result = {
                month: {firstDay: month[incr].firstDay, _id: month[incr]._id},
                availabilities: pxxAvailable
            }
    
            data.push(result);
        }
    }

    if (data) {
        res.status(200).json(data);
    } else {
        res.status(400).json({message: 'no data found'});
    }
});

// @desc    Get All pxx data for spectific month
// @route   GET /api/pxx?practice=practice&month=month&keywork=keywork&pagesize=pagesize&pageNumber=pageNumber
// @access  Private
const getAllPxx = asyncHandler(async (req, res) => {

    const pageSize = Number(req.query.pageSize);
    const page = Number(req.query.pageNumber) || 1; // by default on page 1
    const practice = req.query.practice ;
    const month = req.query.month ;
    const keyword = req.query.keyword ? {
        name: {
            $regex: req.query.keyword,
            $options: 'i'
        }
    } : {};

    const consultants = await Consultant.find({...keyword, practice: practice}).select('_id');
    const consultantsId = consultants.map( consultant => consultant._id);

    const count = await Pxx.countDocuments({ month: month, name: {$in: consultantsId} });
    const pxxs = await Pxx.find({ month: month, name: {$in: consultantsId} })
        .populate('name month')
        .sort({'name': 1})
        .limit(pageSize).skip(pageSize * (page - 1));

    //console.log('pxxs', pxxs);

    if (pxxs) {
        res.status(200).json({pxxs, page, pages: Math.ceil(count/pageSize), count});
    } else {
        res.status(400).json({message: 'no pxx found'});
    }
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
    createPxx
};