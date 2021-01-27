const asyncHandler = require('express-async-handler');
const generateToken = require('../utils/generateToken');
const User = require('../models/userModel.js');
const Consultant = require('../models/consultantModel');
const Access = require('../models/accessModel');
const { myAccessConsultants } = require('../utils/usersFunctions');

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async(req,res) =>{
    const { email, password } = req.body;

    const user = await User.findOne({ email })
        .populate({ path:'consultantProfil', select:'practice name' })
        .populate('profil');
    //console.log(user);
    if(user && (await user.matchPassword(password))) {
        if(user.status === 'Validated') {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                profil: user.profil,
                adminLevel: user.adminLevel,
                consultantProfil: user.consultantProfil,
                status: user.status,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({message: 'your account is not validated yet'})
        }
    } else {
        res.status(401).json({message: 'Invalid email or password'});
        throw new Error('Invalid email or password')
    }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async(req,res) =>{
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if(userExists) {
        res.status(400);
        throw new Error('User already exists')
    }

    // try to associate registered user to consultant profil
    const consultantProfilExist = await Consultant.findOne({ email });
    let consultantProfil = 0;
    //console.log('consultantProfilExist', consultantProfilExist);
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
        res.status(400);
        throw new Error('Invalid user data');
    }
});

/*
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
            adminLevel: user.adminLevel,
        })
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});
*/

/*
// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async(req,res) =>{
    
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
        adminLevel: updateUser.adminLevel,
        token: generateToken(updateUser._id),
    });

    } else {
        res.status(404);
        throw new Error('User not found');
    }
});
*/

// @desc    get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async(req,res) =>{

    const pageSize = Number(req.query.pageSize);
    const page = Number(req.query.pageNumber) || 1; // by default on page 1
    const keyword = req.query.keyword ? {
        name: {
            $regex: req.query.keyword,
            $options: 'i'
        }
    } : {};
    
    const access = req.user.profil.api.filter(x => x.name === 'getUsers')[0].data;

    const consultantsId = await myAccessConsultants(access, req);

    const count = await User.countDocuments({ ...keyword, consultantProfil: {$in: consultantsId} });
    
    const users = await User.find({ ...keyword, consultantProfil: {$in: consultantsId} })
        .populate('consultantProfil').select('-password')
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

    if (user) {
        await user.remove();
        res.json({ message: 'User removed' })
    } else {
        res.status(404);
        throw new Error('User not found');
    }
    
});



// @desc    get user by Id
// @route   GET /api/users/:id
// @access  Private/AdminLevelZero
const getUserById = asyncHandler(async(req,res) =>{
    
    const user = await User.findById(req.params.id)
        .populate('consultantProfil')
        .populate('profil')
        .select('-password');
    if(user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});


// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/AdminLevelOne
const updateUser = asyncHandler(async(req,res) =>{
    
    const user = await User.findById(req.params.id);
    
    if (user) {
        user.name = req.body.name;
        user.email = req.body.email;
        user.profil = req.body.profil;
        user.adminLevel = req.body.adminLevel;
        user.consultantProfil = req.body.consultantProfil;
        user.status = req.body.status;
        const updateUser = await user.save();
        res.json({updateUser});
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});


module.exports = { 
    authUser, 
    //getUserProfile, 
    registerUser, 
    //updateUserProfile, 
    getUsers, 
    deleteUser, 
    getUserById, 
    updateUser
};