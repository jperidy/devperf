const express = require('express');
const { createDeal } = require('../controllers/dealControllers');
const { protect, adminLevelOne, adminLevelZero, empowered } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .post(protect, createDeal);

module.exports = router;