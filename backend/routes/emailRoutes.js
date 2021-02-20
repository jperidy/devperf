const express = require('express');
const { sendStaffingDecisionEmail, collectContacts } = require('../controllers/emailsControllers');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/decision')
    .get(protect, sendStaffingDecisionEmail);

router.route('/contacts')
    .get(protect, collectContacts);
    
module.exports = router;