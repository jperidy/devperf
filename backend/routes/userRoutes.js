const express = require('express');
const { 
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
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');


const router = express.Router();

router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);


router.post('/login', authUser);
router.get('/redirectAz', redirectAZ);
router.get('/loginAz', authUserAz);

router.post('/renewToken', protect, getTransparentNewToken);

router.post('/create-from-ihm', protect, createUserFromIHM);

router.get('/list-to-create', protect, userListToCreate);

router.route('/:id')
    .delete(protect, deleteUser)
    .get(protect, getUserById)
    .put(protect, updateUser);

router.route('/')
    .get(protect, getUsers)
    .post(registerUser);

// router.route('/')
//     .post(registerUser)
//     .get(protect, adminLevelZero, getUsers);

// router.post('/login', authUser);


// router.route('/:id')
//     .delete(protect, adminLevelOne, deleteUser)
//     .get(protect, adminLevelOne, getUserById)
//     .put(protect, adminLevelOne, updateUser);


module.exports = router;