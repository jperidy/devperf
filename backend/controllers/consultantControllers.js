const Consultant = require('../models/consultantModel');
const Skill = require('../models/skillModels');
const Deal = require('../models/dealModel');
const asyncHandler = require('express-async-handler');
const { resetPartialTimePxx, updatePartialTimePxx, resetAllPxx } = require('./pxxControllers');
const { myAccessConsultants, myAuthorizedActionsConsultant } = require('../utils/usersFunctions');
const { update } = require('../models/consultantModel');

// @desc    Create a consultant data by Id
// @route   POST /api/consultants
// @access  Private, authorizeActionOnConsultant
const createConsultant = asyncHandler(async (req, res) => {

    const consultantToCreate = req.body;
    const checkConsultantExist = await Consultant.find({ email: consultantToCreate.email }).select('email');

    if (checkConsultantExist.length === 0) {
        const createdConsultant = await Consultant.create(consultantToCreate);
        res.status(201).json(createdConsultant);
    } else {
        res.status(409).json({ message: 'Consultant already exist' });
    }

});

// @desc    Delete a consultant
// @route   DELETE /api/consultants/:id
// @access  Private, authorizeActionOnConsultant
const deleteConsultant = asyncHandler(async (req, res) => {

    const consultant = await Consultant.findById(req.params.consultantId);

    if (consultant) {
        await consultant.remove()
        res.json({ message: 'Consultant removed: ' + req.params.consultantId });
    } else {
        res.status(404).json({ message: 'Consultant not found: ' + req.params.consultantId });
        throw new Error('Consultant not found: ' + req.params.consultantId);
    }
});

// @desc    Get the list of consultant in a Practice
// @route   GET /api/consultants/practice/:practice
// @access  Private
const getAllConsultants = asyncHandler(async (req, res) => {
    
    const pageSize = Number(req.query.pageSize);
    const page = Number(req.query.pageNumber) || 1; // by default on page 1
    const keyword = req.query.keyword ? {
        name: {
            $regex: req.query.keyword,
            $options: 'i'
        }
    } : {};

    const access = req.user.profil.api.filter(x => x.name === 'getAllConsultants')[0].data;
    const consultantsId = await myAccessConsultants(access, req);
    //const consultantsId = {}

    const count = await Consultant.countDocuments({ ...keyword, _id: {$in: consultantsId} });

    //console.log(consultantsId);
    
    let consultants = await Consultant.find({...keyword, _id: {$in: consultantsId}})
            .sort({'name': 1})
            .limit(pageSize).skip(pageSize * (page - 1));

    if (consultants) {
        res.status(200).json({consultants, page, pages: Math.ceil(count/pageSize), count});
    } else {
        res.status(400).json({message: `No consultants found for practice: ${req.query.practice}` });
    }

});

// @desc    Get my consultant data
// @route   GET /api/consultants
// @access  Private
const getMyConsultants = asyncHandler(async (req, res) => {

    //console.log(req.user)
    const myConsultants = await Consultant.find({ cdmId: req.user.consultantProfil }).sort({'name': 1});
    const myProfil = await Consultant.findById(req.user.consultantProfil._id);
    myConsultants.push(myProfil)
    //console.log(myConsultants)

    res.json(myConsultants);
    
});

// @desc    Get a consultant data by Id
// @route   GET /api/consultants/:consultantId
// @access  Private, authorizeActionOnConsultant
const getConsultant = asyncHandler(async (req, res) => {

    const myConsultant = await Consultant.findById(req.params.consultantId)
        .populate('quality.skill');

    res.json(myConsultant);
});

// @desc    Get a consultant all skills
// @route   GET /api/consultants/:consultantId/skills
// @access  Private
const getConsultantSkills = asyncHandler(async (req, res) => {

    const access = req.user.profil.api.filter(x => x.name === 'getConsultantSkills')[0].data;
    const consultantsId = await myAccessConsultants(access, req);

    const myConsultant = await Consultant.findById(req.params.consultantId)
        .populate('quality.skill')
        .select('quality');

    //console.log(consultantsId.map(x => x._id))
    //console.log(myConsultant._id)

    if(consultantsId.map(x => x._id.toString()).includes(myConsultant._id.toString())){
        res.status(200).json(myConsultant);
    } else {
        res.status(401).json({message: "you are not authorized to access this data"})
    }
});

// @desc    Update a consultant data by Id
// @route   PUT /api/consultants/:consultantId
// @access  Private, authorizeActionOnConsultant
const updateConsultant = asyncHandler(async (req, res) => {

    const consultantToUpdate = req.body;
    let myConsultant = await Consultant.findById(req.params.consultantId);

    if (myConsultant) {


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
        myConsultant.grade = consultantToUpdate.grade;
        myConsultant.arrival = consultantToUpdate.arrival;
        myConsultant.valued = consultantToUpdate.valued;
        myConsultant.leaving = consultantToUpdate.leaving;
        myConsultant.isCDM = consultantToUpdate.isCDM;
        myConsultant.isPartialTime = consultantToUpdate.isPartialTime;

        if (arrivalChange || leavingChange) {
            try {
                await resetAllPxx(myConsultant);
            } catch (error) {
                //console.log('Error: resetAllPxx fail:', error);
                res.status(500).json({ message: 'Error: resetAllPxx fail' });
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
            //console.log('partialTime detected with changement');
            try {
                if (!partialTimeChange && (startChange || endChange)) {
                    //console.log('on va reseter')
                    await resetPartialTimePxx(myConsultant);
                }
                //console.log('on va updater')
                await updatePartialTimePxx(myConsultant, consultantToUpdate.isPartialTime);
            } catch (error) {
                //console.log('Error: updatePartialTimePxx fail', error);
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
            || endChange)
            && !consultantToUpdate.isPartialTime.value) {
            //console.log('suppression du partial time');
            try {
                await resetPartialTimePxx(myConsultant);
            } catch (error) {
                //console.log('Error: resetPartialTimePxx fail', error);
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

    const access = req.user.profil.api.filter(x => x.name === 'getAllCDMData')[0].data;
    const consultantsId = await myAccessConsultants(access, req);
    //console.log(consultantsId)

    const practice = req.params.practice;
    const CDMList = await Consultant.find({_id: {$in: consultantsId}, isCDM: true}).select('_id name');
    
    if (req.user.consultantProfil.isCDM) {
        //console.log(req.user.consultantProfil)
        const myProfil = {_id: req.user.consultantProfil._id, name: req.user.consultantProfil.name}
        CDMList.push(myProfil);
    }

    if (CDMList) {
        res.status(200).json(CDMList);
    } else {
        res.status(400).json({message: `You have no access to this data` });
    }
});

// @desc    Get the list of registered Practices
// @route   GET /api/consultants/practice
// @access  Private
const getAllPracticesData = asyncHandler(async (req, res) => {

    //const practice = req.params.practice;
    const access = req.user.profil.api.filter(x => x.name === 'getAllPracticesData')[0].data;
    const consultantsId = await myAccessConsultants(access, req);

    let practiceListAll = await Consultant.find({_id: {$in: consultantsId}}).select('practice');
    practiceListAll = practiceListAll.map( x => x.practice);
    const practiceUniqueList = [...new Set(practiceListAll)];
    
    if (practiceUniqueList) {
        res.status(200).json(practiceUniqueList);
    } else {
        res.status(400).json({message: `Practice List not found` });
    }
});

// @desc    Get the list of leaders I can add
// @route   GET /api/consultants/leaderslist
// @access  Private
const getAllLeaders = asyncHandler(async (req, res) => {

    const access = req.user.profil.api.filter(x => x.name === 'getLeaders')[0].data;
    const consultantsId = await myAccessConsultants(access, req);

    const searchName = req.query.searchLeader ? 
        { name: {$regex: req.query.searchLeader, $options: 'i'} }
        : {};

    const leadersList = await Consultant.find({_id: {$in: consultantsId}, ...searchName}).select('_id name matricule practice').limit(5);
    
    if (leadersList) {
        res.status(200).json(leadersList);
    } else {
        res.status(400).json({message: `No consultant found` });
    }
});

// @desc    Update user
// @route   PUT /api/consultants/comment
// @access  Private, authorizeActionOnConsultant
const updateConsultantComment = asyncHandler(async(req,res) =>{
    
    const consultant = await Consultant.findById(req.params.consultantId); 
    
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
// @access  Private
const getAllSkills = asyncHandler(async(req,res) =>{
    
    const skills = await Skill.find().sort({category: 1});

    if (skills) {

        res.status(200).json({skills});
    } else {
        res.status(404).json({ message: 'Skills not found' });
        throw new Error('Skills not found');
    }
});

// @desc    Add a skill for a consultant
// @route   PUT /api/consultants/:consultantId/skill
// @access  Private
const addConsultantSkill = asyncHandler(async(req,res) => {
    
    const consultantId = req.params.consultantId;
    const skill = req.body;

    const consultant = await Consultant.findById(consultantId);
    const existingSkillId = consultant.quality.map( x => x.skill);

    if (!existingSkillId.includes(skill.skill)) {
        consultant.quality.push(skill);
        const updatedConsultant = await consultant.save();
        res.status(200).json(updatedConsultant);
    } else {
        res.status(400).json({message: `Can not add skill already registered for the user`});
    }

});

// @desc    Delete a skill for a consultant
// @route   PUT /api/consultants/:consultantId/skill
// @access  Private
const deleteConsultantSkill = asyncHandler(async(req,res) => {
    
    const consultantId = req.params.consultantId;
    const skillId = req.params.skillId;

    const consultant = await Consultant.findById(consultantId);
    const updatedSkills = consultant.quality.filter( x => x.skill.toString() !== skillId.toString());
    consultant.quality = updatedSkills;

    const updatedConsultant = await consultant.save();
    res.status(200).json(updatedConsultant);

});

// @desc    Update a level skill for a consultant
// @route   PUT /api/consultants/:consultantId/skill
// @access  Private
const updateLevelConsultantSkill = asyncHandler(async(req,res) => {
    
    const consultantId = req.params.consultantId;
    const skillId = req.params.skillId;
    const level = req.body.level;

    const consultant = await Consultant.findById(consultantId);
    const updatedQuality = consultant.quality.map( x => {
        if (x.skill.toString() === skillId.toString()) {
            return {skill: skillId, level: level}
        } else {
            return x
        }
    });
    consultant.quality = updatedQuality;

    const updatedConsultant = await consultant.save();
    res.status(200).json(updatedConsultant);

});

// @desc    Get a CDM for a consultant
// @route   GET /api/consultants/:consultantId/cdm
// @access  Private
const getCDM = asyncHandler(async(req,res) => {
    
    const consultantId = req.params.consultantId;
    const consultant = await Consultant.findById(consultantId).select('cdmId');

    if (consultant) {
        const cdm = await Consultant.findById(consultant.cdmId).select('name matricule email practice');
        if (cdm) {
            res.status(200).json(cdm)
        } else {
            res.status(400).json({message: `consultant not found: ${consultant.cdmId}`})    
        }
    } else {
        res.status(400).json({message: `consultant not found: ${consultantId}`})
    }
});

// @desc    Get all staffings
// @route   GET /api/consultants/staffings
// @access  Private, 
const getConsultantStaffings = asyncHandler(async (req, res) => {

    const access = req.user.profil.api.filter(x => x.name === 'getConsultantStaffings')[0].data;
    const consultantsId = await myAccessConsultants(access, req);

    // take this constant from frontend/constants/dealConstants.js
    const DEAL_STATUS = [
        {name: 'Lead', priority: 0, display: 'onTrack'},
        {name: 'Proposal to send', priority: 5, display: 'onTrack'},
        {name: 'Proposal sent', priority: 5, display: 'onTrack'},
        {name: 'Won', priority: 10, display: 'win'},
        {name: 'Abandoned', priority: 0, display: 'lost'},
        {name: 'Lost', priority: 0, display: 'lots'},
    ];

    const consultantId = req.query.consultantId;
    
    if (consultantsId.map(x => x._id.toString()).includes(consultantId)) {
        const staffings = await Deal.find({'staffingDecision.staff.idConsultant': consultantId, status: {$in: DEAL_STATUS.filter(x=>x.display === 'onTrack').map(x => x.name)}});
        
        const result = staffings.map( staff => ({
            _id:staff._id,
            company: staff.company,
            title: staff.title,
            probability: staff.probability,
            startDate: staff.startDate,
            mainPractice: staff.mainPractice,
            requestStatus: staff.staffingRequest.requestStatus,
            status:staff.status,
            instructions: staff.staffingRequest.instructions
        }));
    
        if (staffings) {
            res.status(200).json(result);
        } else {
            res.status(400).json('No others staffings founded');
        }
    } else {
        res.status(401).json({message: 'you are not allowed to access these data'});
    }    
});

const updateAConsultant = async (id, consultant) => {

    const consultantUpdated = await Consultant.findOneAndUpdate({_id: id}, consultant, {new:true});
    return consultantUpdated;
}

const createAConsultant = async (consultant) => {
    //console.log('Create: ' + consultant.name);
    const newConsultant = await Consultant.create(consultant);
    if (newConsultant) {
        return newConsultant;
    } else {
        return '';
    }
}

const transformGrade = (gradeIn) => {
    let gradeOut = '';

    if (gradeIn.match(/Analyst|Analyst Consultant/g)){
        gradeOut = 'Analyst'
    };
    if (gradeIn.match(/Consultant/g)){
        gradeOut = 'Consultant'
    };
    if (gradeIn.match(/Manager/g)){
        gradeOut = 'Manager'
    };
    if (gradeIn.match(/Senior Consultant/g)){
        gradeOut = 'Senior consultant'
    };
    if (gradeIn.match(/Stagiaire|Alternant Conseil/g)){
        gradeOut = 'Intern'
    };
    if (gradeIn.match(/Expert/g)){
        gradeOut = 'Manager'
    };
    if (gradeIn.match(/Account Developper|Account Manager|Business Analyst/g)){
        gradeOut = 'Commercial'
    };
    if (gradeIn.match(/Senior Manager/g)){
        gradeOut = 'Senior manager'
    };
    if (gradeIn.match(/Directeur de projet|Directeur Associé/g)){
        gradeOut = 'Director'
    };
    if (gradeIn.match(/Research analyst|Senior Research Analyst/g)){
        gradeOut = 'Research'
    };
    if (gradeIn.match(/Partner/g)){
        gradeOut = 'Partner'
    };

    if(gradeOut === '') {
        console.log('Grade not recognized: ' + gradeIn);
        gradeOut = 'Unknown'
    }
    
    return gradeOut;
}

// @desc    Create or update consultant data
// @route   PUT /api/consultants/admin/mass-import
// @access  Private, 
const createOrUpdateConsultants = asyncHandler(async (req, res) => {

    const access = req.user.profil.api.filter(x => x.name === 'massImportConsultants')[0].data;

    if (access === 'yes') {
        const consultantsData = req.body;
        if (consultantsData[0]){
            const consultants = consultantsData[0];
            for (let incr = 0 ; incr < consultants.length ; incr++) {

                const searchConsultant = await Consultant.findOne({matricule: consultants[incr].MATRICULE});
                const cdmMatricule = consultants[incr].CDM_MATRICULE ? consultants[incr].CDM_MATRICULE.toString().padStart(9,0) : '';
                const cdmId = await Consultant.findOne({matricule: cdmMatricule}).select('_id');
                //console.log(consultants[incr].CDM_MATRICULE.toString().padStart(9,0));
                //console.log('cdmId', cdmId, 'matricule', cdmMatricule);

                const consultantToUpdateOrCreate = {
                    //_id: searchConsultant._id,
                    name: consultants[incr].NAME,
                    email: consultants[incr].EMAIL,
                    grade: transformGrade(consultants[incr].GRADE),
                    practice: consultants[incr].PRACTICE,
                    matricule: consultants[incr].MATRICULE,
                    arrival: new Date(consultants[incr].START),
                    valued: new Date(consultants[incr].VALUED),
                    leaving: new Date(consultants[incr].LEAVE),
                    isCdm: consultants[incr].IS_CDM,
                    cdmId: cdmId ? cdmId._id : null,
                    isPartialTime:{
                        value: consultants[incr].PARTIAL_TIME === 'true' ? true : false,
                        week: [{num:1, worked:1},{num:2, worked:1},{num:3, worked:1},{num:4, worked:1},{num:5, worked:1}],
                        start: '',
                        end: ''
                    }
                }
                
                let result = '';
                if (searchConsultant) {
                    result = updateAConsultant(searchConsultant._id, consultantToUpdateOrCreate);
                } else {
                    result = createAConsultant(consultantToUpdateOrCreate)
                }

                if (!result){
                    console.log('Error creating or updating: ' + consultants[incr].NAME)
                }
            }
        }

    }
    res.status(200).json('ok');

});



module.exports = { 
    getMyConsultants, 
    getConsultant,
    getConsultantSkills,
    updateConsultant,
    getAllConsultants,
    createConsultant,
    deleteConsultant,
    getAllCDMData,
    getAllPracticesData,
    updateConsultantComment,
    getAllSkills,
    getCDM,
    getAllLeaders,
    addConsultantSkill,
    deleteConsultantSkill,
    updateLevelConsultantSkill,
    getConsultantStaffings,
    createOrUpdateConsultants
    //getAllConsultantByPractice
};