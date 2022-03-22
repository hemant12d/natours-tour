const router = require('express').Router();
const authController = require('../app/http/controllers/authController');
const userController = require('../app/http/controllers/userController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forget-password', authController.forgetPassword);
router.patch('/resetMyPassword/:token', authController.resetPassword);

// Added protect route to all the remaining routes

router.use(authController.protect);

// about me 
router.get('/me', userController.addedIdToReq, userController.getUser);

router.patch('/updateMyPassword', authController.updatePassword);
router.patch('/updateMe', authController.updateMe);
router.delete('/deleteMe', authController.deleteMe);



// Added access middleware with admin access to all of the remaining routes
router.use(authController.access('Admin'));
router.route('/')
    .get(userController.getAllUser);

router.route('/:id')
    .get(userController.getUser)
    .delete(userController.deleteUser)
    // Don't update password on this route
    .patch(userController.updateUser);

module.exports = router;