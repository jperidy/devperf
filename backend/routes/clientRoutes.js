const express = require('express');
const { getClients, addClients, updateClient, deleteAClient } = require('../controllers/clientControllers');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

router.route('/:id')
    .delete(protect, deleteAClient);


router.route('/')
    .get(protect, getClients)
    .post(protect, addClients)
    .put(protect, updateClient);


module.exports = router;