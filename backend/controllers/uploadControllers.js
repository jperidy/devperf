const asyncHandler = require('express-async-handler');
const fs = require('fs');
const path = require('path');

// @desc    Create pxx folder if not existing
// @route   POST /api/upload/pxx
// @access  Private
const checkAndCreatePxxFolder = asyncHandler(async (req, res, next) => {

    const __dir = path.resolve();
    const pathPxx = __dir + '/uploads/pxx/';
    console.log(pathPxx);

    if (fs.existsSync(pathPxx)) {
        next();
    } else {
        /* fs.mkdir(pathPxx, { recursive: true }, (err) => {
            if(err) {
                console.error('Error creating folder to upload Pxx: ' + pathPxx);
                res.status(500).json({message: 'Error creating folder to upload Pxx: ' + pathPxx});
            }
            console.log('Directory created successfully /uploads/pxx: ' + pathPxx);
            next();
        }); */

        try {
            fs.mkdirSync(pathPxx, { recursive: true })
            console.log('Directory created successfully /uploads/pxx: ' + pathPxx);
            next();
        } catch (error) {
            console.error('Error creating folder to upload Pxx: ' + pathPxx);
            res.status(500).json({ message: 'Error creating folder to upload Pxx: ' + pathPxx });
        }
    }

});

// @desc    Create consultant folder if not existing
// @route   POST /api/upload/pxx
// @access  Private
const checkAndCreateConsultantsFolder = asyncHandler(async (req, res, next) => {

    const __dir = path.resolve();
    const pathConsultant = __dir + '/uploads/consultants/';
    console.log(pathConsultant);

    if (fs.existsSync(pathConsultant)) {
        next();
    } else {

        /* fs.mkdir(pathConsultant, { recursive: true }, (err) => {
            if(err) {
                console.error('Error creating folder to upload consultants: ' + pathConsultant);
                res.status(500).json({message: 'Error creating folder to upload consultants: ' + pathConsultant});
            }
            console.log('Directory created successfully: ' + pathConsultant);
            next();
        }); */

        try {
            fs.mkdirSync(pathConsultant, { recursive: true })
            console.log('Directory created successfully: ' + pathConsultant);
            next();
        } catch (error) {
            console.error('Error creating folder to upload consultants: ' + pathConsultant);
            res.status(500).json({message: 'Error creating folder to upload consultants: ' + pathConsultant});
        }
    }

});

module.exports = { checkAndCreatePxxFolder, checkAndCreateConsultantsFolder };