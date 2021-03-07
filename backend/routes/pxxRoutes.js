const express = require('express');
const { 
    getPxx, 
    updatePxx, 
    getProdChart, 
    getAvailabilityChart, 
    getAllPxx, 
    //massImportPxx,
    lineImportPxx,
    updatePxxFromPxx
} = require('../controllers/pxxControllers');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');


router.get('/edit', protect, getPxx);
//router.put('/admin/mass-import', protect, massImportPxx);
router.put('/admin/line-import', protect, lineImportPxx);
router.put('/admin/line-import-wk', protect, updatePxxFromPxx);

router.get('/chart/tace', getProdChart);
router.get('/chart/availability', getAvailabilityChart);

router.route('/')
    .put(protect, updatePxx)
    .get(protect, getAllPxx);


module.exports = router;