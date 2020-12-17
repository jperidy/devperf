const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const mongoose = require('mongoose');
const Consultant = require('../models/consultantModel');

const protect = asyncHandler (async (req, res, next) => {
    //console.log('start protect middleware');
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        
        try {
            token = req.headers.authorization.split(' ')[1]; // delete of first keyword Bearer seperated with space with token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            //console.log('decode.id', decoded.id);
            req.user = await User.findById(decoded.id).select('-password'); // we don't want to add password in the req
            //console.log('req.user', req.user);
            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized, token failed')
        }
    }

    if(!token){
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

const adminLevelZero = (req, res, next) => {
    //console.log('start admin middleware');
    if(req.user && (req.user.adminLevel === 0)) {
        next(); // if user is admin we can continue :)
    } else {
        res.status(401);
        throw new Error('Not authorized as an admin');
    }
}

const adminLevelOne = (req, res, next) => {
    //console.log('start admin middleware');
    if(req.user && (req.user.adminLevel <= 1)) {
        next(); // if user is admin we can continue :)
    } else {
        res.status(401);
        throw new Error('Not authorized as an admin');
    }
}

// is empowered to manage the request :
//      - the CDM of the consultant
//      - the admin of the same practice of the consultant

const empowered = asyncHandler(
    async (req, res, next) => {
        //console.log('start empowered middleware');

        let isEmpowered = false;

        //console.log('req.user', req.user);
        //console.log('req.body', req.body);
        //console.log('req.body.consultantId', req.body.consultantId);
        //console.log('req.params.consultantId', req.params.consultantId);
        if (req.user && (req.body.consultantId || req.params.consultantId)) {
            // Collect list of consultant managed by the login user
            const consultantList = await Consultant.find({cdmId: req.user.consultantProfil}).select('_id');
            //console.log('consultantList', consultantList);

            // verify if the consultant we are looking to reach is in the list of those managed by the login user
            const userIsEmpowered = consultantList.filter( x => [req.body.consultantId, req.params.consultantId].includes(x._id.toString()));
            if (userIsEmpowered.length > 0){
                isEmpowered = true;
            } 
            // verify if user is admin of the practice
            if(req.user.adminLevel <= 1) {
                // verify the practice of current admin user
                const userConsultantProfil = await Consultant.findById(req.user.consultantProfil).select('practice');
                // collect the practice of consultant we want to reach
                const consultantIdPractice = await Consultant.find({_id: {$in: [req.params.consultantId, req.body.consultantId]}}).select('practice');
                if (consultantIdPractice[0].practice === userConsultantProfil.practice) {
                    isEmpowered = true;
                }
            }
        } else {
            res.status(400).json({message: 'Invalid request. Please contact your administrator.'});
        }

        if(isEmpowered) {
            next();
        } else {
            res.status(403).json({message: 'not empowered to access these data'});
            throw new Error('Not empowered to access these data');
        }
    }
) 

module.exports = { protect, adminLevelOne, adminLevelZero, empowered };