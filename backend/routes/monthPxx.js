const express = require('express');
const monthPxxCtrl = require('../controllers/monthPxx');

const router = express.Router();

router.get('/', monthPxxCtrl.getMonthPxx);

module.exports = router;