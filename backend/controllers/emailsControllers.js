const Deal = require('../models/dealModel');
const Consultant = require('../models/consultantModel');
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
            {name: 'Staff to validate by leader', staff: true, priority: 5},
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

// @desc    Get a Deal 
// @route   GET /api/emails
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

        const REQUEST_STATUS = [
            {name: 'Identify Leader', staff: true, priority: 10},
            {name: 'Identify Staff', staff: true, priority: 7},
            {name: 'Staff to validate by leader', staff: true, priority: 5},
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


        
        //for (let incr=0 ; incr<contacts.length ; incr++){

            //const myConsultantsId = (await Consultant.find({cdmId: contacts[incr]._id}).select('_id')).map(x => x._id.toString());

            /*const myLeaderLeads = onTrackDeals.filter(x => (
                x.contacts.primary && contacts[incr]._id && (x.contacts.primary._id.toString() === contacts[incr]._id.toString())
                || x.contacts.secondary && x.contacts.secondary.map(x => x._id).includes(contacts[incr]._id)
            ));*/

            /*const myConsultantsLeads = myConsultantsId ? 
                onTrackDeals.filter(x => myConsultantsId.includes(x.staffingDecision.staff.idConsultant ? x.staffingDecision.staff.idConsultant._id.toString() : '')) 
                : [];

            if(myConsultantsId.length > 0) {
                console.log(myConsultantsId);
                console.log(contacts[incr].name, myConsultantsLeads.length, myConsultantsId.length);
            }*/

            //const myOthersLeads = onTrackDeals.filter(x => x.othersContacts && x.othersContacts.split(',').includes(contacts[incr].email));
            
            /*const decisions = {
                name: contacts[incr].name,
                myRequests: myLeaderLeads,
                myConsultants: myConsultantsLeads,
                myOthers: myOthersLeads
            };*/

            /*
            const mailInfo = {
                to: "jprdevapp@gmail.com, jbperidy@gmail.com",
                subject: "Staffing decisions for" + contacts[incr].name,
                template: "staffingDecisions",
                context: decisions
            };

            if(envoyer) {
                
                try {
                    sleep(1000);
                    await mailService.sendMail(mailInfo);
                    console.log('email sent to :' + contacts[incr].email);
                } catch (error) {
                    console.log('error sending message to: ' + contacts[incr].email);
                    //console.log(error);
                    mailErrors.push({ mailInfo });    
                }
            }
            */
        //}

        /*if(mailErrors.length > 0){
            res.status(500).json({message: mailErrors})
        } else {
            res.status(200).send("email sent");
        }
    }*/

    }
});

module.exports = { sendStaffingDecisionEmail, collectContacts };