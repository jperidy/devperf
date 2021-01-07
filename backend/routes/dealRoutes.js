const express = require('express');
const { createDeal, getAllDeals, deleteDeal, getADeal, updateADeal } = require('../controllers/dealControllers');
const { protect, adminLevelOne, adminLevelZero, empowered } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(protect, adminLevelOne, getAllDeals)
    .post(protect, createDeal)
    .delete(protect, adminLevelOne, deleteDeal);

router.route('/:id')
    .get(protect, getADeal)
    .put(protect, updateADeal);

module.exports = router;