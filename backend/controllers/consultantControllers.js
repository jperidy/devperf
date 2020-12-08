const User = require('../models/userModel');
const Month = require('../models/monthModel');
const asyncHandler = require('express-async-handler');

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


        myConsultant.name = consultantToUpdate.name;
        myConsultant.matricule = consultantToUpdate.matricule;
        myConsultant.arrival = consultantToUpdate.arrival;
        myConsultant.valued = consultantToUpdate.valued;
        myConsultant.leaving = consultantToUpdate.leaving;
        myConsultant.isCDM = consultantToUpdate.isCDM;
        myConsultant.isPartialTime = consultantToUpdate.isPartialTime;
        
        const updatedConsultant = await myConsultant.save();

        if ((partialTimeChange || mondayChange || tuesdayChange || wednesdayChange || thursdayChange || fridayChange ) && consultantToUpdate.isPartialTime.value) {
            
            await updatePartialTimePxx(myConsultant._id, consultantToUpdate.isPartialTime)
        }

        if ((partialTimeChange || mondayChange || tuesdayChange || wednesdayChange || thursdayChange || fridayChange ) && !consultantToUpdate.isPartialTime.value) {
            //console.log('reset Pxx script');
            await resetPartialTimePxx(myConsultant._id, consultantToUpdate.isPartialTime)
        }

        res.status(200).json(updatedConsultant);
    } else {
        res.status(404).json({ message: 'Consultant not found. Please try later' });
        throw new Error('Consultant not found. Please try later');
    }
    
});

const updatePartialTimePxx = async (consultantId, isPartialTime) => {
    console.log('update Pxx script');
    const firstMonthDay = new Date(isPartialTime.start);
    firstMonthDay.setDate(0);
    const endDay = new Date(isPartialTime.end);

    console.log(firstMonthDay.toISOString().substring(0,10));
    console.log(endDay.toISOString().substring(0,10));

    const data = await Month.find({
        firstDay: {
            $gte: firstMonthDay.toISOString().substring(0,10),
            $lte: endDay.toISOString().substring(0,10)
        }
    })

    console.log('data', data);
}

const resetPartialTimePxx = async (consultantId, isPartialTime) => {
        console.log('reset partial time to implemant');
}

module.exports = { getMyConsultants, getConsultant, updateConsultant };