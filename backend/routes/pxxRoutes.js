const express = require('express');
const { getPxx } = require('../controllers/pxxControllers');
const router = express.Router();

router.get('/:ids', getPxx);

module.exports = router;