const express = require('express');
const { createDeal, getAllDeals } = require('../controllers/dealControllers');
const { protect, adminLevelOne, adminLevelZero, empowered } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(protect, adminLevelOne, getAllDeals)
    .post(protect, createDeal);

module.exports = router;