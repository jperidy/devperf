const express = require('express');
const { getMonthPxxInfo } = require('../controllers/monthPxxController');

const router = express.Router();

router.get('/', getMonthPxxInfo);

module.exports = router;