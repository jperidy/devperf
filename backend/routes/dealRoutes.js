const express = require('express');
const { createDeal, getAllDeals, deleteDeal, getADeal, updateADeal } = require('../controllers/dealControllers');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(protect, getAllDeals)
    .post(protect, createDeal)
    .delete(protect, deleteDeal);

router.route('/:id')
    .get(protect, getADeal)
    .put(protect, updateADeal);

module.exports = router;