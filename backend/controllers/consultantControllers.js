const User = require('../models/userModel');
//const Month = require('../models/monthModel');
//const Pxx = require('../models/pxxModel');
const asyncHandler = require('express-async-handler');
//const calculDayByType = require('../utils/calculDayByType');
const { resetPartialTimePxx, updatePartialTimePxx, resetAllPxx } = require('./pxxControllers');


// @desc    Create a consultant data by Id
// @route   POST /api/consultants
// @access  Private, Admin
const createConsultant = asyncHandler(async (req, res) => {

    const consultantToCreate = req.body;
    //Verify if consultant already exist
    const checkConsultantExist = await User.find({email: consultantToCreate.email}).select('email');
    console.log(checkConsultantExist);
    if (checkConsultantExist.length === 0) {
        const createdConsultant = await User.create(consultantToCreate);
        res.status(201).json(createdConsultant);
    } else {
        res.status(409).json({message: 'user already exist'});
    }    
});

// @desc    Get all admin consultant data
// @route   GET /api/admin/consultants
// @access  Private, Admin
const getAllPracticeConsultants = asyncHandler(async (req, res) => {

    const myConsultants = await User.find({ practice: req.user.practice })
                                                    .select('-password')
                                                    .sort({'name': 1});
    res.json(myConsultants);
    
});

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

    const consultantToUpdate = req.body;
    console.log('consultantToUpdate', consultantToUpdate);
    let myConsultant = await User.findById(req.params.consultantId).select('-password');
    console.log('myConsultant', myConsultant);

    if(myConsultant) {

        const partialTimeChange = myConsultant.isPartialTime.value != consultantToUpdate.isPartialTime.value;
        const mondayChange = myConsultant.isPartialTime.week[0].worked != consultantToUpdate.isPartialTime.week[0].worked;
        const tuesdayChange = myConsultant.isPartialTime.week[1].worked != consultantToUpdate.isPartialTime.week[1].worked;
        const wednesdayChange = myConsultant.isPartialTime.week[2].worked != consultantToUpdate.isPartialTime.week[2].worked;
        const thursdayChange = myConsultant.isPartialTime.week[3].worked != consultantToUpdate.isPartialTime.week[3].worked;
        const fridayChange = myConsultant.isPartialTime.week[4].worked != consultantToUpdate.isPartialTime.week[4].worked;
        const startChange = myConsultant.isPartialTime.start != consultantToUpdate.isPartialTime.start;
        const endChange = myConsultant.isPartialTime.end != consultantToUpdate.isPartialTime.end;

        const arrivalChange = myConsultant.arrival != consultantToUpdate.arrival;
        const leavingChange = myConsultant.leaving != consultantToUpdate.leaving;

        //console.log('partialTimeChange', partialTimeChange);
        //console.log('mondayChange', mondayChange);
        //console.log('startChange', startChange, myConsultant.isPartialTime.start, consultantToUpdate.isPartialTime.start);
        //console.log('endChange', endChange, myConsultant.isPartialTime.end, consultantToUpdate.isPartialTime.end);
        //console.log('arrivalChange', arrivalChange, myConsultant.arrival, consultantToUpdate.arrival);
        //console.log('leavingChange', leavingChange, myConsultant.leaving, consultantToUpdate.leaving);


        myConsultant.name = consultantToUpdate.name;
        myConsultant.matricule = consultantToUpdate.matricule;
        myConsultant.cdmId = consultantToUpdate.cdmId;
        myConsultant.arrival = consultantToUpdate.arrival;
        myConsultant.valued = consultantToUpdate.valued;
        myConsultant.leaving = consultantToUpdate.leaving;
        myConsultant.isCDM = consultantToUpdate.isCDM;
        myConsultant.isPartialTime = consultantToUpdate.isPartialTime;
        
        //const updatedConsultant = await myConsultant.save();
        
        // Partial time conditions change, we need to update existing Pxx with new partial time conditions
        /*if ((partialTimeChange
            || mondayChange
            || tuesdayChange
            || wednesdayChange
            || thursdayChange
            || fridayChange
            || startChange
            || endChange)
            && consultantToUpdate.isPartialTime.value) {
        */

        if (arrivalChange || leavingChange) {
            try {
                await resetAllPxx(myConsultant);
            } catch (error) {
                console.log('Error: resetAllPxx fail:', error);
                res.status(500).json({message: 'Error: resetAllPxx fail'});
            }
        }

        if (consultantToUpdate.isPartialTime.value &&
            (mondayChange
            || tuesdayChange
            || wednesdayChange
            || thursdayChange
            || fridayChange
            || startChange
            || endChange)
        ) {
            try {
                if (!partialTimeChange && (startChange || endChange)) {
                    await resetPartialTimePxx(myConsultant);
                }
                await updatePartialTimePxx(myConsultant, consultantToUpdate.isPartialTime);
            } catch (error) {
                console.log('Error: updatePartialTimePxx fail', error);
                res.status(500).json({ message: 'Error: updatePartialTimePxx fail' });
            }
        } 

        // 
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
                await resetPartialTimePxx(myConsultant);
                //const updatedConsultant = await myConsultant.save();
                //res.status(200).json(updatedConsultant);
            } catch (error) {
                console.log('Error: resetPartialTimePxx fail', error);
                res.status(500).json({ message: 'Error: resetPartialTimePxx fail' });
            }
        }
        
        const updatedConsultant = await myConsultant.save();
        res.status(200).json(updatedConsultant);
        
        /*
        if (!partialTimeChange 
            && !mondayChange 
            && !tuesdayChange 
            && !wednesdayChange 
            && !thursdayChange 
            && !fridayChange
            && !startChange
            && !endChange) {
            
            res.status(200).json({updatedConsultant});
        }
        */
        

        //await updatePartialTimePxx(myConsultant, consultantToUpdate.isPartialTime);
        //res.status(200).json(updatedConsultant);

    } else {
        res.status(404).json({ message: 'Consultant not found. Please try later' });
        throw new Error('Consultant not found. Please try later');
    }
    
});

// @desc    Get the list of consultants that are CDM
// @route   GET /api/consultants/cdm/:practice
// @access  Private, Admin
const getAllCDMData = asyncHandler(async (req, res) => {

    console.log('getAllCDMData', req.params)
    const practice = req.params.practice;
    const CDMList = await User.find({practice: practice, isCDM: true}).select('_id name');
    
    if (CDMList) {
        res.status(200).json(CDMList);
    } else {
        res.status(400).json({message: `CDM List not found for: ${practice}` });
    }

});

module.exports = { 
    getMyConsultants, 
    getConsultant, 
    updateConsultant, 
    getAllPracticeConsultants, 
    createConsultant,
    getAllCDMData
};