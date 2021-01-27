const express = require('express');
const { getAllProfils } = require('../controllers/accessControllers');
const { protect } = require('../middleware/authMiddleware');


const router = express.Router();

router.route('/')
    .get(protect, getAllProfils);

module.exports = router