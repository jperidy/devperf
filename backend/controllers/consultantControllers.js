const User = require('../models/userModel');
const Month = require('../models/monthModel');
const Pxx = require('../models/pxxModel');
const asyncHandler = require('express-async-handler');
const calculDayByType = require('../utils/calculDayByType');

// @desc    Get my consultant data
// @route   GET /api/consultants
// @access  Private
const getMyConsultants = asyncHandler(async (req, res) => {

    const myConsultants = await User.find({ cdmId: req.user._id })
                                                    .select('-password')
                                                    .sort({'name': 1});
    res.json(myConsultants);
    
});

// @desc    Get a consultant data by Id
// @route   GET /api/consultants/:consultantId
// @access  Private, Embeded
const getConsultant = asyncHandler(async (req, res) => {

    const myConsultant = await User.findById(req.params.consultantId).select('-password');
    res.json(myConsultant);
    
});

// @desc    Update a consultant data by Id
// @route   PUT /api/consultants/:consultantId
// @access  Private, Embeded
const updateConsultant = asyncHandler(async (req, res) => {

    const consultantToUpdate = req.body
    let myConsultant = await User.findById(req.params.consultantId).select('-password');
    
    if(myConsultant) {

        const partialTimeChange = myConsultant.isPartialTime.value != consultantToUpdate.isPartialTime.value;
        const mondayChange = myConsultant.isPartialTime.week[0].worked != consultantToUpdate.isPartialTime.week[0].worked;
        const tuesdayChange = myConsultant.isPartialTime.week[1].worked != consultantToUpdate.isPartialTime.week[1].worked;
        const wednesdayChange = myConsultant.isPartialTime.week[2].worked != consultantToUpdate.isPartialTime.week[2].worked;
        const thursdayChange = myConsultant.isPartialTime.week[3].worked != consultantToUpdate.isPartialTime.week[3].worked;
        const fridayChange = myConsultant.isPartialTime.week[4].worked != consultantToUpdate.isPartialTime.week[4].worked;
        const startChange = myConsultant.isPartialTime.start != consultantToUpdate.isPartialTime.start;
        const endChange = myConsultant.isPartialTime.end != consultantToUpdate.isPartialTime.end;

        myConsultant.name = consultantToUpdate.name;
        myConsultant.matricule = consultantToUpdate.matricule;
        myConsultant.arrival = consultantToUpdate.arrival;
        myConsultant.valued = consultantToUpdate.valued;
        myConsultant.leaving = consultantToUpdate.leaving;
        myConsultant.isCDM = consultantToUpdate.isCDM;
        myConsultant.isPartialTime = consultantToUpdate.isPartialTime;
        
        
        if ((partialTimeChange
            || mondayChange
            || tuesdayChange
            || wednesdayChange
            || thursdayChange
            || fridayChange
            || startChange
            || endChange)
            && consultantToUpdate.isPartialTime.value) {

            try {
                // reset if modification on start or endDate
                //console.log(startChange, endChange, partialTimeChange);
                if (!partialTimeChange && (startChange || endChange)) {
                    await resetPartialTimePxx(myConsultant._id);
                }

                await updatePartialTimePxx(myConsultant._id, consultantToUpdate.isPartialTime);
                const updatedConsultant = await myConsultant.save();
                res.status(200).json(updatedConsultant);
            } catch (error) {
                console.log('Error: updatePartialTimePxx fail');
                res.status(500).json({ message: 'Error: updatePartialTimePxx fail' });
            }
        }

        if ((partialTimeChange 
            || mondayChange 
            || tuesdayChange 
            || wednesdayChange 
            || thursdayChange 
            || fridayChange
            || startChange
            || endChange ) 
            && !consultantToUpdate.isPartialTime.value) {
            //console.log('reset Pxx script');
            try {
                await resetPartialTimePxx(myConsultant._id);
                const updatedConsultant = await myConsultant.save();
                res.status(200).json(updatedConsultant);
            } catch (error) {
                console.log('Error: resetPartialTimePxx fail');
                res.status(500).json({ message: 'Error: resetPartialTimePxx fail' });
            }
        }
        

    } else {
        res.status(404).json({ message: 'Consultant not found. Please try later' });
        throw new Error('Consultant not found. Please try later');
    }
    
});

const updatePartialTimePxx = async (consultantId, isPartialTime) => {
    //console.log('update Pxx script');

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
    const pxxData = await Pxx.find({ month: {$in: monthId}, name: consultantId})

    for (let incrPxx = 0; incrPxx < pxxData.length; incrPxx++) {
        const idMonth = pxxData[incrPxx].month;
        const monthInfo = monthData.filter( x => x._id.toString() === idMonth.toString())[0];
        const daysInfo = monthInfo.days;
        //console.log("daysInfo", daysInfo);
        let prodDay = 0;
        let notProdDay = 0;
        let leavingDay = 0;
        let availableDay = 0;

        // calculate all available days
        for (let incrDay = 0; incrDay < daysInfo.length; incrDay++) {
            if (daysInfo[incrDay].num >= firstDayPartial && daysInfo[incrDay].num <= endDayPartial) {
                //console.log('  daysInfo.num >= firstDayPartiel and <= enDayPartial', daysInfo[incrDay].num, firstDayPartial, endDayPartial)
                if(daysInfo[incrDay].type == 'working-day') {
                    const numberInTheWeek = Number((new Date(daysInfo[incrDay].num)).getDay());
                    const partialTime = isPartialTime.week.filter( x => Number(x.num) === numberInTheWeek)[0].worked;
                    //console.log('partialTime', partialTime, 'numberInTheWeek', numberInTheWeek);
                    availableDay += Number(partialTime);
                } 
            } else {
                //console.log('! daysInfo.num >= firstDayPartiel and <= enDayPartial', daysInfo[incrDay].num, firstDayPartial, endDayPartial)
                if(daysInfo[incrDay].type == 'working-day') {
                    availableDay += 1;
                }
            }
        }

        //console.log('availableDay', availableDay);

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

    //console.log('data updated', pxxData);

    for (let incr = 0 ; incr < pxxData.length ; incr++) {
        pxxData[incr].save();
    }

}

const resetPartialTimePxx = async (consultantId) => {
    //console.log('reset partial time to implemant');

    const infoConsultant = await User.findById(consultantId);
    const initialPartialTime = infoConsultant.isPartialTime;
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

    let prodDay = 0;
    let notProdDay = 0;
    let leavingDay = 0;
    let availableDay = 0;

    for (let incrPxx = 0; incrPxx < pxxData.length; incrPxx++) {
        const pxx = pxxData[incrPxx];
        const idMonth = pxx.month;
        const monthInfo = monthData.filter(x => x._id.toString() === idMonth.toString())[0];
        const workingDay = calculDayByType(monthInfo.days, 'working-day');

        const initialProdDay = Number(pxx.prodDay);
        const initialNotProdDay = Number(pxx.notProdDay);
        const initialLeavingDay = Number(pxx.leavingDay);

        // recalculate available days
        availableDay = workingDay;


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

        pxxData[incrPxx].prodDay = prodDay;
        pxxData[incrPxx].notProdDay = notProdDay;
        pxxData[incrPxx].leavingDay = leavingDay;
        pxxData[incrPxx].availableDay = availableDay;

    }

    for (let incr = 0; incr < pxxData.length; incr++) {
        pxxData[incr].save();
    }


}

module.exports = { getMyConsultants, getConsultant, updateConsultant };