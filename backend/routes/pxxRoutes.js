const express = require('express');
const { getPxx } = require('../controllers/pxxControllers');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/consultantId/:id/month/:month', protect, getPxx);
//router.get('/consultant/:id', protect, getPxxFromConsultantId);
//router.get('/:ids', protect, getPxx);

module.exports = router;