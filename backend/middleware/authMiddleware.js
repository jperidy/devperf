const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const mongoose = require('mongoose');

const protect = asyncHandler (async (req, res, next) => {
    
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        
        try {
            token = req.headers.authorization.split(' ')[1]; // delete of first keyword Bearer seperated with space with token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            req.user = await User.findById(decoded.id).select('-password'); // we don't want to add password in the req
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

const admin = (req, res, next) => {
    if(req.user && req.user.isAdmin) {
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

        let isEmpowered = false;

        if (req.user && (req.body.consultantId || req.params.consultantId)) {
            const consultantList = await User.find({cdmId: req.user._id}).select('_id');
            const userIsEmpowered = consultantList.filter( x => [req.body.consultantId, req.params.consultantId].includes(x._id.toString()));
            if (userIsEmpowered.length > 0){
                isEmpowered = true;
            } else {
                const consultantIdPractice = await User.find({_id: {$in: [req.params.consultantId, req.body.consultantId]}}).select('practice');
                if (consultantIdPractice[0].practice === req.user.practice) {
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
        
        /*
        if (req.user && (req.body.consultantId || req.params.consultantId)) {
            const consultantList = await User.find({cdmId: req.user._id}).select('_id');
            const userIsEmpowered = consultantList.filter( x => [req.body.consultantId, req.params.consultantId].includes(x._id.toString()));
            if (userIsEmpowered.length > 0){
                next();
            } else {
                res.status(403).json({message: 'not empowered to access these data'});
                throw new Error('Not empowered to access these data');
            }
        } else {
            res.status(401).json({message: 'not empowered to access these data'});
            throw new Error('Not authorized, no token');
        }
        */
    }
) 

module.exports = { protect, admin, empowered };