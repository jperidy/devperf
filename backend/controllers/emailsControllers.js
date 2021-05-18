const Deal = require('../models/dealModel');
const User = require('../models/userModel');
const Client = require('../models/clientModel');
const asyncHandler = require('express-async-handler');
const MailService = require("../config/MailService");
const { multipleMongooseToObj } = require("../utils/emailsFunctions");


const flatArrayTwo = (initialArray) => {
    const flatArray = [];
        for (let incr=0 ; incr<initialArray.length; incr++){
            if(initialArray[incr].length === 1){
                flatArray.push(initialArray[incr][0])
            } else {
                for (let incr2=0 ; incr2<initialArray[incr].length; incr2++){
                    flatArray.push(initialArray[incr][incr2])
                }
            }
        }
    return flatArray;
}

// @desc    Get all contacts to send email 
// @route   GET /api/emails/contacts
// @access  Private
const collectContacts = asyncHandler(async (req, res) => {

    const access = req.user.profil.api.filter(x => x.name === 'sendStaffingDecisionEmails')[0].data;
    let contacts = [];
    let filteredContacts = [];

    if (access === 'yes') {

        const practice = req.user.consultantProfil.practice;

        const REQUEST_STATUS = [
            {name: 'Identify Leader', staff: true, priority: 10},
            {name: 'Identify Staff', staff: true, priority: 7},
            {name: 'Staff to validate by leader', staff: false, priority: 5},
            {name: 'Staff validated by leader', staff: false, priority: 0},
            {name: 'Staff validated by client', staff: false, priority: 0},
            {name: 'You can staff elsewhere', staff: false, priority: 0},
            {name: 'Close', staff: false, priority: 0}
        ];

        const onTrackDeals = multipleMongooseToObj(await Deal.find({
            'staffingRequest.requestStatus': { $in: REQUEST_STATUS.filter(x => x.name !== 'Close').map(x => x.name) },
            $or:[
                {'mainPractice': practice},
                {'othersPractice': practice}
            ]
        }).populate({ path: 'contacts.primary contacts.secondary', select: '_id name email' })
            .populate({ path: 'staffingDecision.staff.idConsultant', select: '_id name matricule practice' }));
        
        const leaders = onTrackDeals.map(x => x.contacts.primary);
        const coLeadersInit = onTrackDeals.map(x => x.contacts.secondary);
        const coLeaders = flatArrayTwo(coLeadersInit);
        const othersContactsInit = onTrackDeals.map(x => {
            if (x.othersContacts) {
                return x.othersContacts.split(',').map(y => ({ email: y, name: '' }))
            } else {
                return []
            }
        });
        const othersContacts = flatArrayTwo(othersContactsInit);
        
        let cdmContacts = await Consultant.find({isCDM:true, practice: practice}).select('name email _id');
        cdmContacts = cdmContacts.map(x => ({email:x.email, name: x.name, _id: x._id}));

        let commercialContacts = await Client.find();
        commercialContacts = commercialContacts.map( x => x.commercialTeam.map( y => ({email: y.contactEmail, name: x.name, _id:y._id})))
        commercialContacts = flatArrayTwo(commercialContacts);
        //commercialContacts = commercialContacts.contactEmail.map(x => ({email: x.contactEmail, name: x.contactName, _id:x._id}));

        contacts = othersContacts.concat(coLeaders).concat(leaders).concat(cdmContacts).concat(commercialContacts);

        for (let incr = 0 ; incr < contacts.length ; incr++){
            if(!filteredContacts.map(x=>x.email).includes(contacts[incr].email)){
                filteredContacts.push(contacts[incr]);
            }
        }
    }

    if (filteredContacts.length > 0) {
        res.status(200).json(filteredContacts);
    } else {
        res.status(401).json({message: 'no contacts found'})
    }
})



function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

// @desc    Send staffing decision email
// @route   GET /api/emails/decision
// @access  Private
const sendStaffingDecisionEmail = asyncHandler(async (req, res) => { 

    const access = req.user.profil.api.filter(x => x.name === 'sendStaffingDecisionEmails')[0].data;

    if(access === 'yes') {

        const genererErrors = false;
        const envoyer = true;

        const email = req.query.email;
        const practice = req.user.consultantProfil.practice;
        const consultantProfil = await Consultant.findOne({email: email}).select('name email _id');
        const company = req.query.name; // only valid for commmercial case

        REQUEST_STATUS = [
            {name: 'Identify Leader', staff: true, priority: 10},
            {name: 'Identify Staff', staff: true, priority: 7},
            {name: 'Staff to validate by leader', staff: false, priority: 5},
            {name: 'Staff validated by leader', staff: false, priority: 0},
            {name: 'Staff validated by client', staff: false, priority: 0},
            {name: 'You can staff elsewhere', staff: false, priority: 0},
            {name: 'Close', staff: false, priority: 0}
        ];

        const onTrackDeals = multipleMongooseToObj(await Deal.find({
            'staffingRequest.requestStatus': { $in: REQUEST_STATUS.filter(x => x.name !== 'Close').map(x => x.name) },
            $or:[
                {'mainPractice': practice},
                {'othersPractice': practice}
            ]
        }).populate({ path: 'contacts.primary contacts.secondary', select: '_id name email' })
            .populate({ path: 'staffingDecision.staff.idConsultant', select: '_id name matricule practice' }));

        const myConsultantsId = consultantProfil ? (
            await Consultant.find({ cdmId: consultantProfil._id }).select('_id')).map(x => x._id.toString()
        ) : [];

        const myLeaderLeads = consultantProfil ? (
            onTrackDeals.filter(x => (
                x.contacts.primary && consultantProfil._id && (x.contacts.primary._id.toString() === consultantProfil._id.toString())
                || x.contacts.secondary && x.contacts.secondary.map(x => x._id.toString()).includes(consultantProfil._id.toString())
            ))
        ) : [];

        let myConsultantsLeads = [];

        for (let incr=0 ; incr < onTrackDeals.length ; incr++){
            const staffedConsultantId = onTrackDeals[incr].staffingDecision.staff ? (
                onTrackDeals[incr].staffingDecision.staff.map(x => x.idConsultant._id.toString())
            ) : [];

            let addDeal = false
            for (let incr2 = 0 ; incr2 < staffedConsultantId.length ; incr2++){
                if(myConsultantsId.includes(staffedConsultantId[incr2])){
                    addDeal = true;
                }
            }
            if (addDeal){
                myConsultantsLeads.push(onTrackDeals[incr]);
            }
        }

        const myOthersLeads = onTrackDeals.filter(x => x.othersContacts && x.othersContacts.split(',').includes(email));

        const myCommercials = onTrackDeals.filter(x => x.company === company);

        const decisions = {
            name: consultantProfil ? consultantProfil.name : company ? company : '',
            myRequests: myLeaderLeads,
            myConsultants: myConsultantsLeads,
            myOthers: myOthersLeads,
            myCommercials: myCommercials
        };

        const currentDate = new Date(Date.now()).toISOString().substring(0,10);

        const mailInfo = {
            to: "jprdevapp@gmail.com", // to add others use ","
            subject: `[${practice}] Staffing decisions for ${email} - ${currentDate}`,
            template: "staffingDecisions",
            context: decisions
        };
            
            try {
                if (genererErrors && Date.now() % 2){
                    throw new Error('test des erreurs');
                }
                if (envoyer) {
                    const mailService = new MailService();
                    //sleep(1000);
                    await mailService.sendMail(mailInfo);
                    console.log('email sent to :' + email);
                }

                res.status(200).send({email: email, message: 'email sent to: ' + email});

            } catch (error) {
                console.log('error sending message to: ' + email, error);
                res.status(500).json({message: email})
                //console.log(error);
                //mailErrors.push({ mailInfo });    
            }
    }
});

// @desc    send email with credendial informations 
// @route   PUT /api/emails/credential
// @access  Private
//const sendLoginInformation = asyncHandler(async (req, res) => {
const sendLoginInformation = async (user, {test}) => {
    
    //console.log(test);
    //const test = true;

    if (['demo'].includes(process.env.NODE_ENV)) {
        test = true;
    }

    let url = '';
    if (process.env.NODE_ENV === 'development') {
        url = process.env.DOMAIN_NAME_DEV
    } else if (['demo'].includes(process.env.NODE_ENV)) {
        url = process.env.DOMAIN_NAME_DEMO
    } else if (process.env.NODE_ENV === 'docker') {
        url = process.env.DOMAIN_NAME_DOCKER
    } else if (process.env.NODE_ENV === 'poc') {
        url = process.env.DOMAIN_NAME_POC
    }

    const credential = {
        name: user.name,
        url: url,
        email: user.email,
        mdp: user.password
    };

    const userToUpdate = (await User.find({email: user.email}))[0];
    //console.log('userToUpdate', userToUpdate);
    
    if (userToUpdate) {
        userToUpdate.password = user.password;
        userToUpdate.status = 'Validated';
        await userToUpdate.save();
        const emailToSend = test ? "jprdevapp@gmail.com" : user.email; // to add others use ","
        const mailInfo = {
            to: emailToSend,
            subject: `[Prévisionnel de charge] Tes informations de connexion`,
            template: "userInscription",
            context: credential
        };
        const mailService = new MailService();
        await mailService.sendMail(mailInfo);
        console.log('email sent to :' + emailToSend);
        //res.status(200).json({message: 'credential modified'});
    } else {
        console.log('consultant not found');
        //res.status(401).json({message: 'consultant not found'});
    }
};

module.exports = { sendStaffingDecisionEmail, collectContacts, sendLoginInformation };