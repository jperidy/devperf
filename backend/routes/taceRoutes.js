const express = require('express');
const { createTaceData } = require('../controllers/taceControllers');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .post(protect, createTaceData);

module.exports = router;