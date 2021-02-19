const Deal = require('../models/dealModel');
const Consultant = require('../models/consultantModel');
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

// @desc    Get a Deal 
// @route   GET /api/deals/sendmails
// @access  Private
const sendStaffingDecisionEmails = asyncHandler(async (req, res) => { 

    const access = req.user.profil.api.filter(x => x.name === 'sendStaffingDecisionEmails')[0].data;
    if(access === 'yes') {
        
        const DEAL_STATUS = [
            {name: 'Lead', priority: 0, display: 'onTrack'},
            {name: 'Proposal to send', priority: 5, display: 'onTrack'},
            {name: 'Proposal sent', priority: 5, display: 'onTrack'},
            {name: 'Won', priority: 10, display: 'win'},
            {name: 'Abandoned', priority: 0, display: 'lost'},
            {name: 'Lost', priority: 0, display: 'lots'},
        ];

        const practice = req.user.practice;
        const myConsultantsId = await Consultant.find({cdmId: req.user._id}).select('_id').map(x => x._id);

        const onTrackDeals = multipleMongooseToObj (await Deal.find({
            status:{$in: DEAL_STATUS.filter(x=>x.display==='onTrack').map(x=>x.name)},
            practice:practice,
        }).populate({path: 'contacts.primary contacts.secondary', select: '_id name email'})
        .populate({path: 'staffingDecision.staff.idConsultant', select: 'name matricule practice'}));

        const leaders = onTrackDeals.map(x => x.contacts.primary);
        const coLeadersInit = onTrackDeals.map(x => x.contacts.secondary);
        const coLeaders = flatArrayTwo(coLeadersInit);
        const othersContactsInit = onTrackDeals.map(x=>{
            if (x.othersContacts) {
                return x.othersContacts.split(',').map(y => ({email:y, name:''}))
            } else {
                return []
            }
        });
        const othersContacts = flatArrayTwo(othersContactsInit);

        let contacts = othersContacts.concat(coLeaders).concat(leaders);

        contacts = [... new Set(contacts)];

        const mailService = new MailService();

        for (let incr=0 ; incr<contacts.length ; incr++){

            const myLeaderLeads = onTrackDeals.filter(x => (
                x.contacts.primary && contacts[incr]._id && (x.contacts.primary._id.toString() === contacts[incr]._id.toString())
                || x.contacts.secondary && x.contacts.secondary.map(x => x._id).includes(contacts[incr]._id)
            ));

            const myConsultantsLeads = myConsultantsId ? 
                onTrackDeals.filter(x => myConsultantsId.includes(x.staffingDecision.staff.idConsultant)) 
                : [];
            const myOthersLeads = onTrackDeals.filter(x => x.othersContacts && x.othersContacts.split(',').includes(contacts[incr].email));

            try {
                const decisions = {
                    name: contacts[incr].name,
                    myRequests: myLeaderLeads,
                    myConsultants: myConsultantsLeads,
                    myOthers: myOthersLeads
                };
    
                const mailInfo = {
                    to: "jprdevapp@gmail.com, jbperidy@gmail.com",
                    subject: "Staffing decisions for" + contacts[incr].name,
                    template: "staffingDecisions",
                    context: decisions
                };
    
                await mailService.sendMail(mailInfo);
                console.log('email sent to :' + contacts[incr].email);
                
            } catch (e) {
                console.log(e);
                //res.status(500).send({message: "Something broke!", error:e});
            }   
        }
        res.send("email sent");
    }
});

module.exports = { sendStaffingDecisionEmails };