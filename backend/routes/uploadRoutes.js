const path = require('path');
const express = require('express');
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const { checkAndCreatePxxFolder, checkAndCreateConsultantsFolder } = require('../controllers/uploadControllers');


const router = express.Router();

const storageConsultants = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/consultants/');
    },
    filename(req, file, cb){
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// cb for callback
function checkFileTypeExcel(file, cb){
    const filetypes = /xls|xlsx|xlsb/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    //const mimetype = filetypes.test(file.mimetype);

    if(extname){
        return cb(null, true);
    } else {
        cb('Excel file only !')
    }
}

const uploadExcelConsultant = multer({
    storage: storageConsultants,
    fileFilter: function(req, file, cb) {
        checkFileTypeExcel(file, cb);
    }
});

router.post('/consultant', protect, checkAndCreateConsultantsFolder, uploadExcelConsultant.single('file'), (req, res) => {
    res.status(200).json({path:`/${req.file.path}`});
});

const storagePxx = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/pxx/');
    },
    filename(req, file, cb){
        //console.log('fileName', file);
        const currentDate = new Date(Date.now());
        const userId = req.user.consultantProfil._id;
        cb(null, `${currentDate.toISOString().substring(0,10)}-${userId}-${file.originalname}`);
    }
});
const uploadExcelPxx = multer({
    storage: storagePxx,
    fileFilter: function(req, file, cb) {
        checkFileTypeExcel(file, cb);
    }
});

router.post('/pxx', protect, checkAndCreatePxxFolder, uploadExcelPxx.single('file'), (req, res) => {
    //console.log('file to upload', req.files, req.file);
    const currentDate = new Date(Date.now());
    const userId = req.user.consultantProfil._id;
    res.status(200).json({path: `${currentDate.toISOString().substring(0,10)}-${userId}`})
    //res.status(200).json({path:`/${req.file}`});
});



module.exports = router;