const express = require('express');
const { getClients, addClients, updateClient, deleteAClient } = require('../controllers/clientControllers');
const router = express.Router();
const { protect, authorizeActionOnCompany } = require('../middleware/authMiddleware');

router.route('/:id')
    .delete(protect, authorizeActionOnCompany, deleteAClient);


router.route('/')
    .get(protect, getClients)
    .post(protect, addClients)
    .put(protect, authorizeActionOnCompany, updateClient);


module.exports = router;