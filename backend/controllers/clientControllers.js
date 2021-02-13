const Client = require('../models/clientModel');
const Deal = require('../models/dealModel');
const asyncHandler = require('express-async-handler');

// @desc    Get clients informations
// @route   GET /api/clients?clientName=X
// @access  Public
const getClients = asyncHandler(async (req, res) => {
    
    const pageSize = Number(req.query.pageSize);
    const page = Number(req.query.pageNumber) || 1;

    const searchClient = req.query.clientName ? {
        name: { $regex: req.query.clientName, $options: 'i'}
    } : {};

    const clients = await Client.find({...searchClient}).limit(pageSize).skip(pageSize * (page - 1));
    const count = clients.length;

    if (clients) {
        res.status(200).json({clients, page, pages: Math.ceil(count / pageSize), count});
    } else {
        res.status(404);
        throw new Error('Clients information not found');
    }
});

// @desc    Add an or several clients informations
// @route   POST /api/clients
// @access  Public
const addClients = asyncHandler(async (req, res) => {
    
    const clients = req.body
    const errors = []

    for (let incr = 0; incr < clients.length ; incr++) {
        const client = await Client.find({name: clients[incr].name})
        if (client.length) {
            errors.push({message: `Client: ${client[0].name} already exist`})
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
    
    //console.log(req.body);
    const clientId = req.body._id;
    const client = await Client.findById(clientId);

    if (client) {
        // Modify all deals with old Name
        try {
            if (client.name !== req.body.name) {
                dealsToModify = await Deal.find({company: client.name});
                for (let incr=0 ; incr<dealsToModify.length ; incr++) {
                    //dealsToModify[incr].company = req.body.name
                    await Deal.updateOne({_id: dealsToModify[incr]._id}, {$set: {company: req.body.name}});
                }
                console.log('deals updated with new company name');
            }
        } catch (error) {
            res.status(500).json({message: 'error updating company name'})
        }

        client.name = req.body.name;
        client.commercialTeam = req.body.commercialTeam;

        await client.save();
        res.status(200).json({message: `client Id: ${clientId} updated`})
    } else {
        res.status(404).json({message: `clientId: ${clientId} not found`})
    }

});

// @desc    Delete a clients
// @route   DELETE /api/clients/:id
// @access  Public
const deleteAClient = asyncHandler(async (req, res) => {
    
    const clientId = req.params.id;
    const clientToDelete = await Client.findById(clientId);

    if(clientToDelete) {
        await clientToDelete.remove();
        res.status(200).json({message: `userId: ${clientId} deleted`})
    } else {
        res.json(404).json({message: `userId: ${clientId} not found`})
    }

});

module.exports = { getClients, addClients, updateClient, deleteAClient }