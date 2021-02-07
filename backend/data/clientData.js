const Deal = require('../models/dealModel');
const Client = require('../models/clientModel')

const getClient = async () => {

    await Client.deleteMany();
    console.log('client data deleted')

    const deals = await Deal.find();
    //console.log(deals);

    const uniqueClients = [... new Set(deals.map(x => x.company.toUpperCase()))]

    const clients = uniqueClients.map(x => ({
        name: x.toUpperCase(),
        commercialTeam:[{contactEmail: `wl-commercial-${x.toLowerCase().replace(' ', '')}@jprmail.com`, contactName: `wl-commercial-${x.toLowerCase().replace(' ', '')}`}]
    }))
    await Client.insertMany(clients);
    console.log('client data created')
}

module.exports = {getClient};