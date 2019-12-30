const User = require('../models/user')
const bcrypt = require('bcryptjs')
const sgMail = require('@sendgrid/mail');
const crypto = require('crypto')
const passport = require('passport')
const Profile = require('../models/profile')
const {validationResult} = require('express-validator')
const sgKey = require('../config/keys').sgKey
sgMail.setApiKey(sgKey)
exports.getSignup = (req,res,next) => {
    if(req.session.isLoggedin){
        return res.redirect('/dashboard')
    }
    let message = req.flash('error')
    if(message.length > 0){
        message = message[0]
    }
    else {
        message = null
    }
    res.render('auth/signup', {
        docTitle:'Signup',
        path:'/signup',
        errorMessage:message,
        oldInputs:{
            username:'',
            email:'',
            password:'',
            contact:''
        },
        validationErrors:[]
    })
}
exports.postSignup = (req,res,next) => {
const { username, email, password, contact} = req.body;
const errors = validationResult(req)
if(!errors.isEmpty()){
    console.log(errors)
    return res.status(422)
        .render('auth/signup', {
            docTitle:'Signup',
            path:'/signup',
            errorMessage:errors.array()[0].msg,
            oldInputs:{
                username,
                email,
                password,
                contact
            },
            validationErrors:errors.array()
        })
}
 bcrypt.hash(password, 12).then(password => {
    const user = new User({
        username,
        email,
        contact,
        password
    })
   return user.save()
 }).then(user => {
     req.session.isLoggedin = true
     req.session.isManualLoggedin = true
     req.session.user = user;
     req.session.isGoogleLoggedin = false
     req.session.isTwitterLoggedin = false
     console.log(req.session.user)
     return req.session.save((err) => {
            sgMail.send({
            to:email,
            from:'hello@amcubes.com',
            subject:'Signup Successful :)',
            html:'<h2 style="font-family:segoe ui symbol">Thanks For Signing Up</h2>'
             })
         console.log(err)
         res.redirect('/profile')
     })
 }).catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     })
}
exports.getLogin = (req,res,next) => {
    if(req.session.isLoggedin){
        return res.redirect('/dashboard')
    }
     let message = req.flash('error')
     if(message.length>0){
         message = message[0]
     }
     else {
         message = null
     }
    res.render('auth/login', {
        docTitle:'Login',
        path:'/login',
        errorMessage:message,
        oldInputs:{
            email:'',
            password:''
        },
        validationErrors:[]
    })
}
exports.postLogin = (req,res,next) => {
  const {email, password} = req.body;
  const errors = validationResult(req)
if(!errors.isEmpty()){
    console.log(errors)
    return res.status(422)
        .render('auth/login', {
            docTitle:'Login',
            path:'/login',
            errorMessage:errors.array()[0].msg,
            oldInputs:{
                email,
                password
            },
            validationErrors:errors.array()
        })
}
  User.findOne({email}).then(user => {
      if(!user){    
        return res.status(422)
        .render('auth/login', {
            docTitle:'Login',
            path:'/login',
            errorMessage:'Invalid Email or Password!',
            oldInputs:{
                email,
                password
            },
            validationErrors:errors.array()
        })
      }
      bcrypt.compare(password, user.password).then(hashBool =>{
          if(hashBool){
             req.session.user = user;
             req.session.isLoggedin = true;
            //  req.session.isGoogleLoggedin = false
            //  req.session.isTwitterLoggedin = false
             return req.session.save((err) => {
               res.redirect('/dashboard')
             }) 
          }
          else{
            return res.status(422)
            .render('auth/login', {
                docTitle:'Login',
                path:'/login',
                errorMessage:'Invalid Email or Password!',
                oldInputs:{
                    email,
                    password
                },
                validationErrors:errors.array()
            })
          }
      })
  }).catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     })
}
exports.postLogout = (req,res,next) => {
    // if(req.session.isGoogleLoggedin){
    //     req.session.destroy((err) => {
    //         req.logout()
    //         res.redirect('/login')
    //     })
    // }
    // else if(req.session.isTwitterLoggedin){
    //     req.session.destroy((err) => {
    //         req.logout()
    //         res.redirect('/login')
    //     })
    // }
    // else {
    //     req.session.destroy((err) => {
    //         res.redirect('/login')
    //     })
    // }
    req.session.destroy((err) => {
        res.redirect('/login')
    })
}
exports.getForgotPassword = (req,res,next) => {
    if(req.session.isLoggedin){
        return res.redirect('/dashboard')
    }
    let message = req.flash('error')
    if(message.length > 0) {
        message = message[0]
    }
    else {
        message = null
    }
    res.render('auth/forgotpassword', {
        docTitle:'Forgot Password',
        path:'/forgotpassword',
        errorMessage:message
    })
}
exports.postForgotPassword = (req,res,next) => {
    let { email } = req.body;
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422)
        .render('auth/forgotpassword', {
            docTitle:'Forgot Password',
            path:'/forgotpassword',
            errorMessage:'Please Enter a Valid Email Address.',
        })
    } else {
        crypto.randomBytes(32, (err, buffer) => {
            if(err){
                console.log(err) 
                req.flash('err', 'Error While Generating Token')
                return res.redirect('/forgotpassword')
            }
            const token = buffer.toString('hex')
            User.findOne({email}).then(user => {
                if(!user){
                    req.flash('error', 'No Account With That Email Found')
                    return res.redirect('/forgotpassword');
                }
                user.resetToken = token
                user.tokenExpiry = Date.now() + 3600000
                return user.save().then(user => {
                res.render('auth/forgotpassword', {
                    docTitle:'Forgot Password',
                    path:'/forgotpasswordsuccess',
                    errorMessage:null         
                })
                sgMail.send({
                    to:email,
                    from:'hello@amcubes.com',
                    subject:'Amcubes Reset Your Password!!',
                    html:`
                    <h3 style="font-family:segoe ui symbol">You've Requested to Reset Your Password - Amcubes</h3>
                    <h3 style="font-family:segoe ui symbol"> Click on this link to Set a New Password </h3>
                    <p><a href="https://amcubes.com/resetpassword/${token}">
                    https://amcubes.com/resetpassword/${token}
                    </a> <br> 
                   <span style="font-family:segoe ui symbol">
                   Link will Expire Within 1 Hour.</span>
                    </p>
                    `
                })
            })
            }).catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     })
        }) 
    } 
}
exports.getResetPassword = (req, res, next) => {
    if(req.session.isLoggedin){
        return res.redirect('/account')
    }
    let key = req.params.key
    User.findOne({resetToken:key, tokenExpiry:{$gt:Date.now()}}).then(user => {
        let message = req.flash('error')
        if(message.length> 0){
            message = message[0]
        }
        else {
            message = null
        }
        if(!user){
            req.flash('error', 'Token Expired or Invalid Token')
            return res.redirect(`/resetpassword/${key}`)
        }
        res.render('auth/resetpassword', {
            docTitle:'Reset Password',
            path:'/resetpassword',
            errorMessage:message,
            userId:user._id.toString(),
            passwordToken:key
        })
    }).catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     })
}
exports.postResetPassword = (req, res, next) => {
    const {token, password, confirmpassword, userId } = req.body
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        req.flash('error', 'Password must be minimum 6 characters & Passwords should match!')
        return res.redirect(`/resetpassword/${token}`)
    }
     User.findOne({resetToken:token,  tokenExpiry:{$gt:Date.now()}, _id:userId}).then(user => {
       if(confirmpassword === password){
           bcrypt.hash(password, 12).then(hashedPass => {
               user.password = hashedPass
               user.resetToken = undefined
               user.tokenExpiry = undefined
               return  user.save()
           }).then(user => {
               res.redirect('/login')
           })
       }
       else {
        req.flash('error', 'Passwords Do not Match!')
        return res.redirect(`/resetpassword/${token}`)
       }
     }).catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     })
    }

exports.getGoogleSignin = passport.authenticate('google', {
    scope:['profile', 'email']
})

exports.getGoogleSigninRedirect = (req, res, next) => {
    console.log(req.user)
    req.session.user = req.user
    req.session.isLoggedin = true
    req.session.isGoogleLoggedin = true
    req.session.save()
    setTimeout(() =>{
        res.redirect('/contact-continue')
    }, 500)

}
exports.contactContinue = (req, res, next) => {
   User.findOne({_id:req.session.user._id}).then(user => {
        if(!user.contact){
            return res.render('continue', {
            docTitle:'Contact',
            path:'/contact-continue'
        })
       } else {
          return res.redirect('/dashboard')
       }
   }).catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     })
}
exports.postContact = (req, res, next) => {
    const { contact } = req.body;
    User.findById(req.session.user._id).then(user => {
        user.contact = contact
        user.save().then(user => {
            req.session.user = user
            return res.redirect('/profile')
        })
    }).catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     })
}

exports.getTwitterSignin = passport.authenticate('twitter')

exports.getTwitterSigninRedirect = (req, res, next) => {
    console.log('reached here')
    req.session.user = req.user
    req.session.isLoggedin = true
    req.session.isTwitterLoggedin = true
    req.session.save()
    setTimeout(() =>{
        res.redirect('/contact-continue')
    }, 500)
}
