function getDeals (nbDeal, consultants, practices) {
    //console.log('consultants', consultants);
    //console.log('practices', practices);

    const companies = ['TOTAL', 'SOCIETE GENERALE', 'ENGIE', 'BANQUE DE FRANCE', 'SNCF', "L'OREAL", 'EDF'];
    const client = ['Richard', 'Benoit', 'Jacques', 'Laurine', 'Isabelle', 'Jeanne', 'Arthur', 'Jessica', 'Jean', 'Paul', 'Marion', 'Julien', 'Sophie'];
    const status = ['Lead', 'Proposal to send', 'Proposal sent', 'Won', 'Abandoned']
    const requestStatus = ['To do', 'Keep staffing', 'Retreat staffing', 'Release staffing'];
    const probability = [10, 30, 50, 70, 100];
    const location = ['Lyon', 'Bruxelles', 'Paris', 'Marseille']

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

        const deal = {
            company: company,
            client: client[Math.floor(Math.random() * client.length)],
            title: `Sfaffing request ${company} ${incr + 1}`,
            status: status[Math.floor(Math.random() * status.length)],
            contacts: {
                primary: consultantsPractice[Math.floor(Math.random() * consultantsPractice.length)]._id,
                secondary: [consultantsPractice[Math.floor(Math.random() * consultantsPractice.length)]._id]
            },
            probability: probability[Math.floor(Math.random() * probability.length)],
            description: 'Description de la mission, description des enjeux, etc.',
            proposalDate: proposalDate,
            presentationDate: new Date(Number(proposalDate) + 1000 * 3600 * 24 * 6),
            wonDate: '',
            startDate: new Date(Number(proposalDate) + 1000 * 3600 * 24 * 10),
            mainPractice: mainPractice,
            othersPractices: othersPractices,
            location: location[Math.floor(Math.random() * location.length)],
            staffingRequest: {
                instructions: 'Description du dispositif et des compétences. Description des marges de manoeuvre. etc.',
                requestStatus: requestStatus[Math.floor(Math.random() * requestStatus.length)],
            },       
            staffingDecision: {
                instructions: 'Vérifier la disponibilité de ... sauf démarrage autre mission ...',
            }
        }

        dealData.push(deal);
    }

    return dealData;
}

module.exports = { getDeals }