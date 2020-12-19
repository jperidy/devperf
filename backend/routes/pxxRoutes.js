const express = require('express');
const { getPxx, updatePxx, getProdChart } = require('../controllers/pxxControllers');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

router.put('/', protect, updatePxx );
router.get('/consultantId/:id/month/:month', protect, getPxx);


// in construction
router.get('/chart/tace', getProdChart);
//router.get('/consultant/:id', protect, getPxxFromConsultantId);
//router.get('/:ids', protect, getPxx);

module.exports = router;