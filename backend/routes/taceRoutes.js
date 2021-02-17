const express = require('express');
const { createTaceData } = require('../controllers/taceControllers');
const { protect, authorizeActionOnTace } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .post(protect, authorizeActionOnTace, createTaceData);

module.exports = router;