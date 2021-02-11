const express = require('express');
const { createDeal, getAllDeals, deleteDeal, getADeal, updateADeal } = require('../controllers/dealControllers');
const { protect, authorizeActionOnDeal } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(protect, getAllDeals)
    .post(protect, createDeal)
    //.delete(protect, deleteDeal);

router.route('/:id')
    .get(protect, getADeal)
    .put(protect, authorizeActionOnDeal, updateADeal)
    .delete(protect, authorizeActionOnDeal, deleteDeal);

module.exports = router;