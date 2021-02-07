const Client = require('../models/clientModel');
const asyncHandler = require('express-async-handler');

// @desc    Get clients informations
// @route   GET /api/clients?clientName=X
// @access  Public
const getClients = asyncHandler(async (req, res) => {
    
    const searchClient = req.query.clientName ? {
        name: { $regex: req.query.clientName, $options: 'i'}
    } : {};

    const clients = await Client.find({...searchClient});

    if (clients) {
        res.status(200).json(clients);
    } else {
        res.status(404);
        throw new Error('Clients information not found');
    }
});

// @desc    Add an or several clients informations
// @route   POST /api/clients
// @access  Public
const addClients = asyncHandler(async (req, res) => {
    
    const clients = req.params.clients
    const errors = []

    for (let incr = 0; incr < clients.length ; incr++) {
        const client = await Client.find({name: clients[incr].name})
        if (client) {
            errors.push({message: `Client: ${client.name} already exist`})
        } else {
            const clientToCreate = new Client(clients[incr]);
            await clientToCreate.save();
        }
    }

    res.status(200).json({success: true, message: errors})

});

// @desc    Update a client informations
// @route   PUT /api/clients
// @access  Public
const updateClient = asyncHandler(async (req, res) => {
    
    const clientId = req.params.client._id

    const client = await Client.findById(clientId);

    if (client) {
        client.name = req.params.client.name;
        client.commercialTeam = req.params.client.commercialTeam;
        await client.save();
        res.status(200).json({message: `client Id: ${clientId} updated`})
    } else {
        res.status(404).json({message: `clientId: ${clientId} not found`})
    }

});

module.exports = { getClients, addClients, updateClient }