const express = require('express');
const { 
    getPxx, 
    updatePxx, 
    getProdChart, 
    getAvailabilityChart, 
    getAllPxx, 
    massImportPxx
} = require('../controllers/pxxControllers');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');


router.get('/edit', protect, getPxx);
router.put('/admin/mass-import', protect, massImportPxx);

router.get('/chart/tace', getProdChart);
router.get('/chart/availability', getAvailabilityChart);

router.route('/')
    .put(protect, updatePxx)
    .get(protect, getAllPxx);


module.exports = router;