const Deal = require('../models/dealModel');
const Client = require('../models/clientModel');
const Mail = require('nodemailer/lib/mailer');

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

const initClient = async () => {
    const clientData = [
        {
            name: "TOTAL",
            commercialTeam: [
                { contactEmail: 'commercial_total@Mail.com', contactName: 'commercial_total'},
                { contactEmail: 'nom_total@Mail.com', contactName: 'nom_total'},
            ]

        },{
            name: "ENGIE",
            commercialTeam: [
                { contactEmail: 'commercial_engie@Mail.com', contactName: 'commercial_engie'},
                { contactEmail: 'nom_engie@Mail.com', contactName: 'nom_engie'},
            ]

        }
    ];

    try {
        const createdClient = await Client.insertMany(clientData);
        return {data: createdClient, message: `Client created: ${createdClient.length}`}
    } catch (error) {
        console.log(error);
        return {data: error, message: 'Error no client data imported'}
    }
}

module.exports = {getClient, initClient};