const express = require('express');
const { getPxx, updatePxx } = require('../controllers/pxxControllers');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

router.put('/', protect, updatePxx );
router.get('/consultantId/:id/month/:month', protect, getPxx);
//router.get('/consultant/:id', protect, getPxxFromConsultantId);
//router.get('/:ids', protect, getPxx);

module.exports = router;