const express = require('express');
const { createDeal, getAllDeals, deleteDeal, getADeal, updateADeal, getOldDeals, sendMails } = require('../controllers/dealControllers');
const { protect, authorizeActionOnDeal } = require('../middleware/authMiddleware');

const router = express.Router();

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