const { calculatePriority } = require("../utils/dealsFunctions");

function getDeals (nbDeal, consultants, practices) {
    //console.log('consultants', consultants);
    //console.log('practices', practices);

    const companies = ['TOTAL', 'SOCIETE GENERALE', 'ENGIE', 'BANQUE DE FRANCE', 'SNCF', "L'OREAL", 'EDF'];
    const client = ['Richard', 'Benoit', 'Jacques', 'Laurine', 'Isabelle', 'Jeanne', 'Arthur', 'Jessica', 'Jean', 'Paul', 'Marion', 'Julien', 'Sophie'];
    //const status = ['Lead', 'Proposal to send', 'Proposal sent', 'Won', 'Abandoned']
    //const requestStatus = ['To do', 'Keep staffing', 'Retreat staffing', 'Release staffing'];
    const REQUEST_STATUS = [
        {name: 'Identify Leader', staff: true},
        {name: 'Identify Staff', staff: true},
        {name: 'Staff validated by leader', staff: false},
        {name: 'Staff validated by client', staff: false},
        {name: 'You can staff elsewhere', staff: true}
    ];
    const TYPE_BUSINESS = [
        {name: 'New business'},
        {name: 'New position'},
        {name: 'Replacement'}
    ];
    const DEAL_STATUS = [
        {name: 'Lead'},
        {name: 'Proposal to send'},
        {name: 'Proposal sent'},
        {name: 'Won'},
        {name: 'Abandoned'},
    ];
    const probability = [10, 30, 50, 70, 100];
    const location = ['Lyon', 'Bruxelles', 'Paris', 'Marseille'];

    const responsability = ['Project director', 'Project manager', 'Project leader', 'X', 'Intern'];
    const priority = ['P1', 'P2', 'P3'];

    const dealData = [];

    for (let incr = 0 ; incr < nbDeal ; incr++) {

        const mainPractice = practices[Math.floor(Math.random() * practices.length)];
        const consultantsPractice = consultants.filter(x => x.practice === mainPractice);
        const company = companies[Math.floor(Math.random() * companies.length)];

        //consultantsPractice = consultantsPractice.map(x => x.practice);
        //console.log(consultantsPractice);
        const proposalDate = new Date(2021, Math.floor(Math.random() * 11), Math.floor(Math.random() * 20));
        let othersPractices = [];
        for (let i = 0 ; i<=1 ; i++){
            const other = practices[Math.floor(Math.random() * practices.length)];
            if (other !== mainPractice) {
                othersPractices.push(other);
            }
        }

        const currentStatus = DEAL_STATUS[Math.floor(Math.random() * DEAL_STATUS.length)].name;
        const currentWonDate = (currentStatus === 'Won') ? ( new Date(Date.now()) ) : ( '' );

        const nbTeam = Math.floor(Math.random() * 4);
        const staffing = [];

        for (let incr2 = 0 ; incr2 < nbTeam ; incr2++) {
            staffing.push({
                responsability: responsability[Math.floor(Math.random() * responsability.length)],
                idConsultant: consultantsPractice[Math.floor(Math.random() * consultantsPractice.length)]._id,
                priority: priority[Math.floor(Math.random() * priority.length)],
                information: 'Information for staffing (actions, priority, etc.)'
            })
        }
        //console.log("staffing", staffing);

        let deal = {
            company: company,
            client: client[Math.floor(Math.random() * client.length)],
            title: `Sfaffing request ${company} ${incr + 1}`,
            status: currentStatus,
            type: TYPE_BUSINESS[Math.floor(Math.random()) * TYPE_BUSINESS.length].name,
            contacts: {
                primary: consultantsPractice[Math.floor(Math.random() * consultantsPractice.length)]._id,
                secondary: [consultantsPractice[Math.floor(Math.random() * consultantsPractice.length)]._id]
            },
            probability: probability[Math.floor(Math.random() * probability.length)],
            description: 'Description de la mission, description des enjeux, etc.',
            proposalDate: proposalDate,
            presentationDate: new Date(Number(proposalDate) + 1000 * 3600 * 24 * 6),
            wonDate: currentWonDate,
            startDate: new Date(Number(proposalDate) + 1000 * 3600 * 24 * 10),
            mainPractice: mainPractice,
            othersPractices: othersPractices,
            location: location[Math.floor(Math.random() * location.length)],
            staffingRequest: {
                instructions: 'Description du dispositif et des compétences. Description des marges de manoeuvre. etc.',
                requestStatus: REQUEST_STATUS.map(x=>x.name)[Math.floor(Math.random() * REQUEST_STATUS.length)],
            },       
            staffingDecision: {
                instructions: 'Vérifier la disponibilité de ... sauf démarrage autre mission ...',
                staff: staffing
            },
            createdAt: new Date(Number(proposalDate) - 1000 * 3600 * 24 * ( 20 + 6 * Math.floor(Math.random()))),
            updatedAt: new Date(Number(proposalDate) - 1000 * 3600 * 24 * ( 5 + 14 * Math.floor(Math.random())))
        }
        const priority = calculatePriority(deal);
        deal.priority = priority;

        dealData.push(deal);
    }

    return dealData;
}

module.exports = { getDeals }