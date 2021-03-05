const path = require('path');
const express = require('express');
const multer = require('multer');

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
    const filetypes = /xls|xlsx/;
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

router.post('/consultant', uploadExcelConsultant.single('file'), (req, res) => {
    res.status(200).json({path:`/${req.file.path}`});
    /* if (err instanceof multer.MulterError) {
        res.status(500).json(err)
    } else if (err) {
        res.status(500).json(err)
    } else {
        res.status(200).send(`/${req.file.path}`);
    }  */
});

module.exports = router;