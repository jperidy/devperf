const express = require('express');
const { getClients, addClients, updateClient } = require('../controllers/clientControllers');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getClients)
    .post(protect, addClients)
    .put(protect, updateClient)

module.exports = router;