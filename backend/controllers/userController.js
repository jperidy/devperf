const asyncHandler = require('express-async-handler');
const generateToken = require('../utils/generateToken');
const User = require('../models/userModel.js');

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async(req,res) =>{
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if(user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            matricule: user.matricule,
            arrival: user.arrival,
            leaving: user.leaving,
            seniority: user.seniority,
            isAdmin: user.isAdmin,
            isCDM: user.isCDM,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
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

    const user = await User.create({
        name,
        email,
        password
    });

    if (user) {
 
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
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

// @desc    get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async(req,res) =>{
    
    const users = await User.find({});
    res.json(users);
    
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
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
// @access  Private/Admin
const getUserById = asyncHandler(async(req,res) =>{
    
    const user = await User.findById(req.params.id).select('-password');
    if(user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
    
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async(req,res) =>{
    
    const user = await User.findById(req.params.id); // with protect middleware we had _id in the req
    
    if (user) {
        user.name = req.body.name || user.name; // in the case if you do not change the name
        user.email = req.body.email || user.email;
        user.isAdmin = req.body.isAdmin; // || user.isAdmin;
    
        const updateUser = await user.save();

        res.json({
            _id: updateUser._id,
            name: updateUser.name,
            email: updateUser.email,
            isAdmin: updateUser.isAdmin
        });} else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user
// @route   PUT /api/users/comment
// @access  Private
const updateUserComment = asyncHandler(async(req,res) =>{
    
    //console.log(req.body);
    const user = await User.findById(req.body.consultantId); 
    
    if (user) {

        user.comment = req.body.commentText;
        const updateUser = await user.save();

        res.status(200).json({
            _id: updateUser._id,
            comment: updateUser.comment
        });
    } else {
        res.status(404).json({ message: 'User not found' });
        throw new Error('User not found');
    }
});

module.exports = { 
    authUser, 
    getUserProfile, 
    registerUser, 
    updateUserProfile, 
    getUsers, 
    deleteUser, 
    getUserById, 
    updateUser,
    updateUserComment
};