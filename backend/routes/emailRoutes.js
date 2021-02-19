const express = require('express');
const { sendStaffingDecisionEmails } = require('../controllers/emailsControllers');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/staffingdecisions')
    .get(protect, sendStaffingDecisionEmails);

module.exports = router;