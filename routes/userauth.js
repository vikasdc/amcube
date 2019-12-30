const express = require('express')
const router = express.Router()
const userAuth = require('../controllers/userauth')
const isAuth = require('../middleware/is-auth-user')
const User = require('../models/user')
const { check } = require('express-validator')
// const passport = require('passport')
// const isGoogleAuth = require('../middleware/is-google-auth')

router.get('/signup', userAuth.getSignup)
router.post('/signup', [
    check('username','Please enter a name with min 3 chars without numbers and symbols!')
    .isLength({min:3})
    .isAlpha()
    .trim(),
    check('email', 'Please enter a valid email address.')
    .isEmail()
    .normalizeEmail()
    .custom((email, {req}) => {
        return User.findOne({email}).then(user => {
            if(user){
                return Promise.reject('Account with that email already exists! Please choose another one.')
            }
        })
    }),
    check('contact', 'Please enter a valid contact number of 10 numbers')
    .isLength({min:10,max:10})
    .isNumeric()
    .trim(),
    check('password', 'Please Enter a Passowrd Containing min 6 Characters Including letters and Numbers')
    .isLength({min:6})
    .trim()
],userAuth.postSignup)

router.get('/login', userAuth.getLogin)
router.post('/login',[
     check('email', 'Invalid Email or Password!')
     .isEmail()
     .normalizeEmail(),
     check('password','Please Enter a Valid Password')
],userAuth.postLogin)

router.post('/logout', isAuth, userAuth.postLogout)

// router.get('/google', userAuth.getGoogleSignin)
// router.get('/google/redirect', passport.authenticate('google', {
//     failureRedirect:'/contact-continue'
// }), userAuth.getGoogleSigninRedirect)

// router.get('/contact-continue', isGoogleAuth, userAuth.contactContinue)
// router.post('/contact-continue', isGoogleAuth, userAuth.postContact)

// router.get('/twitter', userAuth.getTwitterSignin)
// router.get('/twitter/redirect', passport.authenticate('twitter', {
//     failureRedirect:'/contact-continue'
// }), userAuth.getTwitterSigninRedirect)

router.get('/forgotpassword', userAuth.getForgotPassword)
router.post('/forgotpassword',check('email').isEmail().normalizeEmail(),userAuth.postForgotPassword)

router.get('/resetpassword/:key', userAuth.getResetPassword)
router.post('/resetpassword',[
    check('password')
    .isLength({min:6})
    .trim(),
    check('confirmpassword')
    .trim()
],userAuth.postResetPassword)


module.exports = router;