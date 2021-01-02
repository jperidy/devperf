const express = require('express');
const { 
    getPxx, 
    updatePxx, 
    getProdChart, 
    getAvailabilityChart, 
    getAllPxx 
} = require('../controllers/pxxControllers');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .put(protect, updatePxx)
    .get(protect, getAllPxx);

//router.get('/consultantId/:id/month/:month', protect, getPxx);
router.get('/edit', protect, getPxx);

router.get('/chart/tace', getProdChart);
router.get('/chart/availability', getAvailabilityChart);

// in construction
//router.get('/consultant/:id', protect, getPxxFromConsultantId);
//router.get('/:ids', protect, getPxx);

module.exports = router;