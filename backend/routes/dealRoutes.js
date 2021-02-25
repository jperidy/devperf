const express = require('express');
const { createDeal, getAllDeals, deleteDeal, getADeal, updateADeal, getOldDeals, createOrUpdateDeals } = require('../controllers/dealControllers');
const { protect, authorizeActionOnDeal } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/admin/mass-import')
    .put(protect, createOrUpdateDeals);

router.route('/old')
    .get(protect, getOldDeals);

router.route('/:id')
    .get(protect, getADeal)
    .put(protect, authorizeActionOnDeal, updateADeal)
    .delete(protect, authorizeActionOnDeal, deleteDeal);

router.route('/')
    .get(protect, getAllDeals)
    .post(protect, createDeal)
    //.delete(protect, deleteDeal);

    
module.exports = router;