const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../config/passport_local_authentication');
const controller = require('../controllers/users')
const profilecontroller = require('../controllers/profile')

const UserController = require('../controllers/users');
router.get('/signIn',UserController.user_sign_in_controller);
router.get('/signUp', UserController.user_sign_up_controller);
router.post('/create', UserController.create);
router.post('/create-session', UserController.createSession);
router.post('/signOut', UserController.signout);
router.get("/UserProfile/",passport.checkAuthentication,profilecontroller.get_profile)
router.post('/Update/', passport.checkAuthentication,profilecontroller.update_profile)
router.post('/login', passport.authenticate('local', { failureRedirect: '/user/signIn',successRedirect: '/' }));
router.get('/auth/google', passport.authenticate('google',{scope:['profile','email']}));
router.get('/auth/google/callback', passport.authenticate('google', {successRedirect: '/',failureRedirect : '/user/signIn'}), controller.createSession);
router.get('/forget_password', UserController.forget_password);
router.post('/change_password', UserController.change_password);


module.exports = router;