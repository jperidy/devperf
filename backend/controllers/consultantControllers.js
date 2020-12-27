const Consultant = require('../models/consultantModel');
const Skill = require('../models/skillModels');
const asyncHandler = require('express-async-handler');
const { resetPartialTimePxx, updatePartialTimePxx, resetAllPxx } = require('./pxxControllers');
//const { set } = require('mongoose');

// @desc    Create a consultant data by Id
// @route   POST /api/consultants
// @access  Private, Admin
const createConsultant = asyncHandler(async (req, res) => {

    const consultantToCreate = req.body;
    //Verify if consultant already exist
    const checkConsultantExist = await Consultant.find({email: consultantToCreate.email}).select('email');
    if (checkConsultantExist.length === 0) {
        const createdConsultant = await Consultant.create(consultantToCreate);
        res.status(201).json(createdConsultant);
    } else {
        res.status(409).json({message: 'Consultant already exist'});
    }    
});

// @desc    Delete a consultant
// @route   DELETE /api/consultants/:id
// @access  Private, Admin
const deleteConsultant = asyncHandler(async (req, res) => {

    const consultant = await Consultant.findById(req.params.consultantId);

    if (consultant) {
        await consultant.remove()
        res.json({ message: 'Consultant removed: ' + req.params.consultantId });
    } else {
        res.status(404).json({message: 'Consultant not found: ' + req.params.consultantId});
        throw new Error('Consultant not found: ' + req.params.consultantId);
    }

});

/*
// @desc    Get all admin consultant data
// @route   GET /api/admin/consultants
// @access  Private, Admin
const getAllPracticeConsultants = asyncHandler(async (req, res) => {

    const userConsultantProfil = await Consultant.findById(req.user.consultantProfil).select('practice');
    const myConsultants = await Consultant.find({ practice: userConsultantProfil.practice })
                                                    .sort({'name': 1});
    res.json(myConsultants);
    
});
*/

// @desc    Get the list of consultant in a Practice
// @route   GET /api/consultants/practice/:practice
// @access  Private/AdminLevelOne
const getAllConsultants = asyncHandler(async (req, res) => {
    
    const pageSize = Number(req.query.pageSize);
    const page = Number(req.query.pageNumber) || 1; // by default on page 1
    const keyword = req.query.keyword ? {
        name: {
            $regex: req.query.keyword,
            $options: 'i'
        }
    } : {};
    
    const practice = req.query.practice;

    const count = await Consultant.countDocuments({ ...keyword, practice: practice });

    //const practice = req.params.practice;
    let consultants = await Consultant.find({...keyword, practice: practice})
            .sort({'name': 1})
            .limit(pageSize).skip(pageSize * (page - 1));

    if (consultants) {
        res.status(200).json({consultants, page, pages: Math.ceil(count/pageSize), count});
    } else {
        res.status(400).json({message: `No consultants found for practice: ${practice}` });
    }

});

/*
// @desc    Get the list of consultant in a Practice
// @route   GET /api/consultants/practice/:practice
// @access  Private/AdminLevelOne
const getAllConsultantByPractice = asyncHandler(async (req, res) => {
    
    const practice = req.params.practice;
    let consultants = await Consultant.find({practice: practice}).sort({'name': 1});

    if (consultants) {
        res.status(200).json(consultants);
    } else {
        res.status(400).json({message: `No consultants found for practice: ${practice}` });
    }

});
*/

// @desc    Get my consultant data
// @route   GET /api/consultants
// @access  Private
const getMyConsultants = asyncHandler(async (req, res) => {

    //console.log(req.user);
    //const myUser = await User.findById(req.user._id);
    const myConsultants = await Consultant.find({ cdmId: req.user.consultantProfil })
                                                    .sort({'name': 1});
    res.json(myConsultants);
    
});

// @desc    Get a consultant data by Id
// @route   GET /api/consultants/:consultantId
// @access  Private, Embeded
const getConsultant = asyncHandler(async (req, res) => {

    const myConsultant = await Consultant.findById(req.params.consultantId)
        .populate('quality.skill');
    res.json(myConsultant);
    
});

// @desc    Update a consultant data by Id
// @route   PUT /api/consultants/:consultantId
// @access  Private, Embeded
const updateConsultant = asyncHandler(async (req, res) => {

    const consultantToUpdate = req.body;
    let myConsultant = await Consultant.findById(req.params.consultantId);

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

        myConsultant.name = consultantToUpdate.name;
        myConsultant.matricule = consultantToUpdate.matricule;
        myConsultant.cdmId = consultantToUpdate.cdmId;
        myConsultant.arrival = consultantToUpdate.arrival;
        myConsultant.valued = consultantToUpdate.valued;
        myConsultant.leaving = consultantToUpdate.leaving;
        myConsultant.isCDM = consultantToUpdate.isCDM;
        myConsultant.isPartialTime = consultantToUpdate.isPartialTime;

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
            try {
                await resetPartialTimePxx(myConsultant);
            } catch (error) {
                console.log('Error: resetPartialTimePxx fail', error);
                res.status(500).json({ message: 'Error: resetPartialTimePxx fail' });
            }
        }
        
        const updatedConsultant = await myConsultant.save();
        res.status(200).json(updatedConsultant);
 
    } else {
        res.status(404).json({ message: 'Consultant not found. Please try later' });
        throw new Error('Consultant not found. Please try later');
    }
    
});

// @desc    Get the list of consultants that are CDM
// @route   GET /api/consultants/cdm/:practice
// @access  Private
const getAllCDMData = asyncHandler(async (req, res) => {

    //console.log('getAllCDMData', req.params)
    const practice = req.params.practice;
    const CDMList = await Consultant.find({practice: practice, isCDM: true}).select('_id name');
    
    if (CDMList) {
        res.status(200).json(CDMList);
    } else {
        res.status(400).json({message: `CDM List not found for: ${practice}` });
    }

});

// @desc    Get the list of registered Practices
// @route   GET /api/consultants/practice
// @access  Private
const getAllPracticesData = asyncHandler(async (req, res) => {

    //const practice = req.params.practice;
    let practiceListAll = await Consultant.find().select('practice');
    practiceListAll = practiceListAll.map( x => x.practice);
    const practiceUniqueList = [...new Set(practiceListAll)];
    
    if (practiceUniqueList) {
        res.status(200).json(practiceUniqueList);
    } else {
        res.status(400).json({message: `Practice List not found` });
    }

});

// @desc    Update user
// @route   PUT /api/consultants/comment
// @access  Private
const updateConsultantComment = asyncHandler(async(req,res) =>{
    
    //console.log('req.params.id', req.params.consultantId);
    const consultant = await Consultant.findById(req.params.consultantId); 
    //console.log('consultant', consultant);
    if (consultant) {

        consultant.comment = req.body.commentText;
        const updateUser = await consultant.save();

        res.status(200).json({
            _id: updateUser._id,
            comment: updateUser.comment
        });
    } else {
        res.status(404).json({ message: 'User not found' });
        throw new Error('User not found');
    }
});

// @desc    Get all registered skills
// @route   GET /api/consultants/skills
// @access  Private/AdminLevelOne
const getAllSkills = asyncHandler(async(req,res) =>{
    
    const skills = await Skill.find().sort({category: 1});

    if (skills) {

        res.status(200).json({skills});
    } else {
        res.status(404).json({ message: 'Skills not found' });
        throw new Error('Skills not found');
    }
});



module.exports = { 
    getMyConsultants, 
    getConsultant, 
    updateConsultant,
    getAllConsultants,
    //getAllPracticeConsultants, 
    createConsultant,
    deleteConsultant,
    getAllCDMData,
    getAllPracticesData,
    updateConsultantComment,
    getAllSkills
    //getAllConsultantByPractice
};