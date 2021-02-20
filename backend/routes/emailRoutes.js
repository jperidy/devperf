const express = require('express');
const { sendStaffingDecisionEmails, collectContacts } = require('../controllers/emailsControllers');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/staffingdecisions')
    .get(protect, sendStaffingDecisionEmails);

router.route('/contacts')
    .get(protect, collectContacts);
    
module.exports = router;