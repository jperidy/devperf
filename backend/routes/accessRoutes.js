const express = require('express');
const { getAllProfils, updateProfil } = require('../controllers/accessControllers');
const { protect } = require('../middleware/authMiddleware');


const router = express.Router();

router.route('/')
    .get(protect, getAllProfils)
    .put(protect, updateProfil);

module.exports = router