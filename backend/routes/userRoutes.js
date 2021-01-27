const express = require('express');
const { 
    authUser, 
    registerUser,
    getUsers, 
    deleteUser, 
    getUserById, 
    updateUser
} = require('../controllers/userController');
const { protect, empowered } = require('../middleware/authMiddleware');


const router = express.Router();

router.route('/')
    .get(protect, getUsers)
    .post(registerUser);
router.post('/login', authUser);

router.route('/:id')
    .delete(protect, deleteUser)
    .get(protect, getUserById)
    .put(protect, updateUser);

/*
router.route('/')
    .post(registerUser)
    .get(protect, adminLevelZero, getUsers);

router.post('/login', authUser);

router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);
router.route('/:id')
    .delete(protect, adminLevelOne, deleteUser)
    .get(protect, adminLevelOne, getUserById)
    .put(protect, adminLevelOne, updateUser);
*/

module.exports = router;