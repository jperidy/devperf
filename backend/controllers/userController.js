const asyncHandler = require('express-async-handler');
const generateToken = require('../utils/generateToken');
const User = require('../models/userModel.js');
const Consultant = require('../models/consultantModel');
const Access = require('../models/accessModel');
const { myAccessUsers } = require('../utils/usersFunctions');
const { cca } = require('../config/authConfig');
const { generatePassword } = require('../utils/generatePassword');
const { sendLoginInformation } = require('./emailsControllers');

// @desc    get url to redirect to connect on AZ
// @route   GET /api/users/redirectAz
// @access  Public
const redirectAZ = asyncHandler(async (req, res) => {
    const authCodeUrlParameters = {
        scopes: ["user.read"],
        //redirectUri: "http://localhost:5000/api/users/redirect",
        redirectUri: process.env.AZ_REDIRECT_URI,
    };

    cca.getAuthCodeUrl(authCodeUrlParameters).then((response) => {
        res.status(200).json({redirectURL: response});
        //res.redirect(response);
    }).catch((error) => console.log(JSON.stringify(error)));

});

// @desc    Auth user & get token
// @route   GET /api/users/tokenAz
// @access  Public
const authUserAz = asyncHandler(async (req, res) => {
    const tokenRequest = {
        code: req.query.code,
        scopes: ["user.read"],
        redirectUri: process.env.AZ_REDIRECT_URI,
    };

    try {

        const response = await cca.acquireTokenByCode(tokenRequest);
        console.log(response);

        const email = response.idTokenClaims.preferred_username;

        const user = await User.findOne({ email })
        .populate({ path:'consultantProfil', select:'practice name isCDM' })
        .populate('profil');

        if (user && user.status === 'Validated') {

            user.lastConnexion = new Date(Date.now());
            await user.save();
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                profil: user.profil,
                adminLevel: user.adminLevel,
                consultantProfil: user.consultantProfil,
                status: user.status,
                token: response.idToken,
                lastConnexion: user.lastConnexion
            });
        } else {
            res.status(401).json({message: `You can not access account ${email}. Verify email or ask administrator to validate your account`});
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});


// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {

    //console.log('req.query.code',req.query.code);
    const maxTry = 3;

    const { email, password } = req.body;

    const user = await User.findOne({ email })
        .populate({ path: 'consultantProfil', select: 'practice name isCDM' })
        .populate('profil');
    if (user) {
        if (await user.matchPassword(password)) {
            if (user.status === 'Validated') {
                user.tryConnect.try = 0;
                user.tryConnect.lastTry = new Date(Date.now());
                user.lastConnexion = new Date(Date.now());
                await user.save();
                res.json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    profil: user.profil,
                    adminLevel: user.adminLevel,
                    consultantProfil: user.consultantProfil,
                    status: user.status,
                    token: generateToken(user._id),
                    lastConnexion: user.lastConnexion
                    //lastConnexion: "2021-04-26T17:20:50.298Z"
                });
                return;
            } else {
                user.tryConnect.try = 0;
                user.tryConnect.lastTry = new Date(Date.now());
                await user.save();
                res.status(401).json({ message: `Your account is not validated: ${user.status}.
                Please contact your administrator.` });
                return;
            }
        } else {
            if (user.status === 'Validated') {
                // for the first connection
                if (!user.tryConnect || !user.tryConnect.try) {
                    user.tryConnect.try = 0;
                    user.tryConnect.lastTry = new Date(Date.now());
                }
        
                if ((Date.now() - (new Date(user.tryConnect.lastTry)).getTime()) / (1000 * 3600 * 24) <= 1) {
                    user.tryConnect.try = user.tryConnect.try += 1;
                    user.tryConnect.lastTry = new Date(Date.now());
    
                    //console.log(user.tryConnect.try)
                    if(user.tryConnect.try >= maxTry) {
                        user.tryConnect.try = 0;
                        user.tryConnect.lastTry = new Date(Date.now());
                        user.status = 'Blocked';
                        await user.save();
                        res.status(401).json({ message: `Sorry your account has been blocked. Please contact your administrator` });
                        return
                    }
    
                    await user.save();
                    res.status(401).json({ message: `Invalid password. You can try x${maxTry - user.tryConnect.try}` });
                    return;
                } else {
                    user.tryConnect.try = 1;
                    user.tryConnect.lastTry = new Date(Date.now());
                    await user.save();
                    res.status(401).json({ message: `Invalid password. You can try x${maxTry - user.tryConnect.try}x.` });
    
                }
            } else {
                res.status(401).json({ message: `Your account is not validated: ${user.status}.
                Please contact your administrator.` });
                return;
            }

            //res.status(401).json({ message: 'Invalid email or password' });
        }

    } else {
        res.status(401).json({message: 'Email not found'});
    }


});

// @desc    get new token for already auth user
// @route   POST /api/users/renewToken
// @access  Public
const getTransparentNewToken = asyncHandler(async (req, res) => {
    
    const { email, delay } = req.body;

    //console.log('delay', Number(delay));
    
    if (Number(delay) > 0.7 && Number(delay) < 1) {
        
        const user = await User.findOne({ email })
            .populate({ path: 'consultantProfil', select: 'practice name isCDM' })
            .populate('profil');

        if (user && user.status === 'Validated') {
            user.tryConnect.try = 0;
            user.tryConnect.lastTry = new Date(Date.now());
            user.lastConnexion = new Date(Date.now());
            await user.save();
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                profil: user.profil,
                adminLevel: user.adminLevel,
                consultantProfil: user.consultantProfil,
                status: user.status,
                token: generateToken(user._id),
                lastConnexion: user.lastConnexion
            });
            return;
        } else {
            res.status(401).json({
                message: `New token not granted to ${email}.` });
            return;
        }
    } else {
        res.status(401).json({
            message: `Not allowed to ask new token ${email}` });
        return;
    }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async(req,res) =>{
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if(userExists) {
        res.status(400).json({message: 'User already exists'});
    }

    // try to associate registered user to consultant profil
    const consultantProfilExist = await Consultant.findOne({ email });
    let consultantProfil = 0;
    if (consultantProfilExist) {
        consultantProfil = consultantProfilExist._id;
    } 

    const user = await User.create({
        name,
        email,
        password,
        consultantProfil: consultantProfil || null,
        adminLevel: 10,
        status: 'Waiting approval'
    });

    if (user) {
 
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            consultantProfil: user.consultantProfil,
            adminLevel: user.adminLevel,
            status: 'Waiting approval',
            token: generateToken(user._id)
        });
    } else {
        res.status(400).json({message: 'Invalid user data'});
    }
});

// @desc    get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async(req,res) => {

    const pageSize = Number(req.query.pageSize);
    const page = Number(req.query.pageNumber) || 1; // by default on page 1

    const searchName = req.query.searchName ? {
        name: {
            $regex: req.query.searchName,
            $options: 'i'
        }
    } : {};
    const searchStatus = req.query.searchStatus ? {
        status: {
            $regex: req.query.searchStatus,
            $options: 'i'
        }
    } : {};
    
    const access = req.user.profil.api.filter(x => x.name === 'getUsers')[0].data;
    // const consultantsId = await myAccessConsultants(access, req);
    // const count = await User.countDocuments({ ...keyword, consultantProfil: {$in: consultantsId} });
    // const users = await User.find({ ...keyword, consultantProfil: {$in: consultantsId} })
    //     .populate('consultantProfil').select('-password')
    //     .populate('profil')
    //     .limit(pageSize).skip(pageSize * (page - 1));
    const usersId = await myAccessUsers(access, req);
    //console.log(usersId);
    const count = await User.countDocuments({ ...searchName, ...searchStatus, _id: {$in: usersId} });
    const users = await User.find({ ...searchName, ...searchStatus, _id: {$in: usersId} })
        .populate('consultantProfil').select('-password')
        .populate('profil')
        .limit(pageSize).skip(pageSize * (page - 1));

    if (users) {
        res.status(200).json({ users, page, pages: Math.ceil(count / pageSize), count });
    } else {
        res.status(400).json({ message: `No users found` });
    }
    
});


// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/AdminLevelZero
const deleteUser = asyncHandler(async(req,res) =>{
    
    const user = await User.findById(req.params.id);
    const access = req.user.profil.api.filter(x => x.name === 'deleteUser')[0].data;
    // const consultantsId = await myAccessConsultants(access, req);
    const usersId = await myAccessUsers(access, req);

    if (user) {

        if (usersId.map(x => x._id.toString()).includes(user._id.toString())) {
            await user.remove();
            res.json({ message: 'User removed' })
        } else {
            res.status(400).json({message: 'you are not allowed to delete this user'});
        }

        // if (consultantsId.map(x => x._id.toString()).includes(user.consultantProfil._id.toString())) {
        //     await user.remove();
        //     res.json({ message: 'User removed' })
        // } else {
        //     res.status(400).json({message: 'you are not allowed to delete this user'});
        // }
    } else {
        res.status(404).json({message: 'User not found'});
    }
    
});


// @desc    get user by Id
// @route   GET /api/users/:id
// @access  Private/AdminLevelZero
const getUserById = asyncHandler(async(req,res) =>{

    const access = req.user.profil.api.filter(x => x.name === 'getUserById')[0].data;
    console.log('access', access);
    //const consultantsId = await myAccessConsultants(access, req);
    const usersId = await myAccessUsers(access, req);
    
    const user = await User.findById(req.params.id)
        .populate('consultantProfil')
        .populate('profil')
        .select('-password');

    if(user) {
        if (usersId.map(x => x._id.toString()).includes(user._id.toString())) {
            res.json(user);
        } else {
            res.status(404).json({message: 'you are not allowed to access this data'});
        }

        // if (consultantsId.map(x => x._id.toString()).includes(user.consultantProfil._id.toString())) {
        //     res.json(user);
        // } else {
        //     res.status(404).json({message: 'you are not allowed to access this data'});
        // }
    } else {
        res.status(404).json({message: 'User not found'});
    }
});


// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/AdminLevelOne
const updateUser = asyncHandler(async(req,res) =>{
    
    const user = await User.findById(req.params.id);

    const access = req.user.profil.api.filter(x => x.name === 'updateUser')[0].data;
    //const consultantsId = await myAccessConsultants(access, req);
    const usersId = await myAccessUsers(access, req);
    
    if (user) {
        if (usersId.map(x => x._id.toString()).includes(user._id.toString())) {
            user.name = req.body.name;
            user.email = req.body.email;
            user.profil = req.body.profil;
            user.adminLevel = req.body.adminLevel;
            user.consultantProfil = req.body.consultantProfil;
            user.status = req.body.status;
            const updateUser = await user.save();
            res.json({updateUser});
        } else {
            res.json(400).json({message: 'you are not allowed to update this user'});
        }
    } else {
        res.status(404).json({message: 'User not found'});
    }
});

// @desc    get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async(req,res) =>{
    
    const user = await User.findById(req.user._id); // with protect middleware we had _id in the req
    
    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        })
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async(req,res) =>{
    
    //console.log('req.user', req.user)
    const user = await User.findById(req.user._id); // with protect middleware we had _id in the req
    
    if (user) {
        user.name = req.body.name || user.name; // in the case if you do not change the name
        user.email = req.body.email || user.email;
        if (req.body.password) {
            user.password = req.body.password;
        }
    const updateUser = await user.save();

    res.json({
        _id: updateUser._id,
        name: updateUser.name,
        email: updateUser.email,
        isAdmin: updateUser.isAdmin,
        token: generateToken(updateUser._id),
    });

    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get all users not already created
// @route   GET /api/users/list-to-create?practice=${practice}&keyword=${keyword}&pageNumber=${pageNumber}&pageSize=${pageSize}
// @access  Private
const userListToCreate = asyncHandler(async(req,res) =>{
    
    const access = req.user.profil.api.filter(x => x.name === 'userListToCreate')[0].data;

    if (access === 'yes') {
        const pageSize = Number(req.query.pageSize);
        const page = Number(req.query.pageNumber) || 1; // by default on page 1
        const consultantName = req.query.consultantName ? {
            name: {
                $regex: req.query.consultantName,
                $options: 'i'
            }
        } : {};
    
        const cdmName = req.query.cdmName
        
        let searchCdm = {};
        if (cdmName) {
            let cdmIds = await Consultant.find({name:{$regex: cdmName, $options:'i'}, isCDM: true, practice: req.query.practice}).select('_id');
            cdmIds = cdmIds.map(x => x._id);
            //console.log(cdmIds);
            searchCdm = {cdmId: {$in: cdmIds}};
        }
    
        const allCreatedUsers = await User.find();
        const consultantIdAssociatedToUser = allCreatedUsers.map(x => x.consultantProfil);
    
        const filter = {
            practice: req.query.practice,
            _id: {$not: {$in: consultantIdAssociatedToUser}},
            ...consultantName,
            ...searchCdm
        };
        //console.log(filter);
    
        const count = await Consultant.countDocuments(filter);
        
        let consultantsToCreate;
        if (pageSize === 'all') {
            consultantsToCreate = await Consultant.find(filter).populate('cdmId');
        } else {
            consultantsToCreate = await Consultant.find(filter)
                .populate('cdmId')
                .limit(pageSize).skip(pageSize * (page - 1));
        }
    
        if (consultantsToCreate) {
            res.status(200).json({ usersListToCreate: consultantsToCreate, page, pages: Math.ceil(count / pageSize), count });
        } else {
            res.status(400).json({ message: `No consultant to create found found` });
        }
    } else {
        res.status(403).json({message: 'not allowed to access this resource'});
    }

});

const matchProfil = async (grade, isCDM) => {

    let profilId;
    if (isCDM) {
        profilId = await Access.findOne({profil: 'cdm'}).select('_id');
    } else {
        switch (grade) {
            case 'Intern':
                profilId = await Access.findOne({profil: 'consultant'}).select('_id');
            case 'Analyst':
                profilId = await Access.findOne({profil: 'consultant'}).select('_id');
            case 'Consultant':
                profilId = await Access.findOne({profil: 'consultant'}).select('_id');
            case 'Senior consultant':
                profilId = await Access.findOne({profil: 'consultant'}).select('_id');
            case 'Manager':
                profilId = await Access.findOne({profil: 'manager'}).select('_id');
            case 'Senior manager':
                profilId = await Access.findOne({profil: 'manager'}).select('_id');
            case 'Director':
                profilId = await Access.findOne({profil: 'manager'}).select('_id');
            case 'Partner':
                profilId = await Access.findOne({profil: 'manager'}).select('_id');
            case 'Unknown':
                profilId = await Access.findOne({profil: 'consultant'}).select('_id');
            case 'Commercial':
                profilId = await Access.findOne({profil: 'consultant'}).select('_id');
            case 'Research':
                profilId = await Access.findOne({profil: 'consultant'}).select('_id');
            default:
                profilId = await Access.findOne({profil: 'consultant'}).select('_id');
        }
    }
    return profilId;
};

// @desc    Create an user from IHM
// @route   POST /api/users/create-from-ihm
// @access  Private
const createUserFromIHM = asyncHandler(async(req,res) =>{

    const access = req.user.profil.api.filter(x => x.name === 'createUserFromIHM')[0].data;

    if (access === 'yes') {
        const consultant = req.body;
        const alreadyExist = await User.find({email: consultant.email});
        if (!alreadyExist.length) {
            const user = {
                name: consultant.name,
                email: consultant.email,
                password : generatePassword(),
                consultantProfil: consultant._id,
                isCDM: consultant.isCDM,
                profil: await matchProfil(consultant.grade, consultant.isCDM),
                status: 'Validated'
            }
            const newUser = await User.create(user);
            if (newUser) {
                try {
                    await sendLoginInformation(user, {test: false});
                    res.status(200).json({message: `Success user ${consultant.email} created`, consultantId: consultant._id});
                } catch (error) {
                    res.status(400).json({message: error, consultantId: consultant._id});
                }
            } else {
                res.status(400).json({message: `Error creating user: ${consultant.email}`, consultantId: consultant._id});
            }
        } else {
            res.status(400).json({message: `Error user ${consultant.email} already exist`, consultantId: consultant._id});
        }
    } else {
        res.status(403).json({message: 'not allowed to access this resource'});
    }

});

module.exports = { 
    redirectAZ,
    authUserAz,
    authUser, 
    registerUser, 
    getUsers, 
    deleteUser, 
    getUserById, 
    updateUser,
    getUserProfile,
    updateUserProfile,
    getTransparentNewToken,
    userListToCreate,
    createUserFromIHM
};