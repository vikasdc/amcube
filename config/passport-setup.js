const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const TwitterStrategy = require('passport-twitter')
const keys = require('./keys')
const User = require('../models/user')

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
        done(null, user)
    })
})

passport.use(new GoogleStrategy({
    
    callbackURL:'/google/redirect',
    clientID:keys.Google.clientID,
    clientSecret:keys.Google.clientSecret
}, (accessToken, refreshToken, profile, done) => {
    console.log('passport callback fired profile:',profile._json)
    User.findOne({googleId:profile._json.sub}).then(user => {
    if(!user){
        const user = new User({
            profileImg:profile._json.picture,
            username:profile._json.name,
            email:profile._json.email,
            googleId:profile._json.sub
        })
        user.save().then(userd => {
            console.log('user created')
            done(null, userd)
        })
    } else {
        done(null, user)
    }
          
    }).catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     })
}))

passport.use(new TwitterStrategy({
   callbackURL:'https://amcubes.com/twitter/redirect',
   consumerKey:keys.Twitter.consumerKey,
   consumerSecret:keys.Twitter.consumerSecret,
   includeEmail: true

}, (token, tokenSecret, profile, done) => {
    console.log(profile._json.email)

    User.findOne({twitterId:profile._json.id_str}).then(user => {
        if(!user){
            const user = new User({
                profileImg:profile._json.profile_image_url,
                username:profile._json.name,
                email:profile._json.email,
                twitterId:profile._json.id_str
            })
            user.save().then(userd => {
                console.log('user created')
                done(null, userd)
            })
        }
        console.log(profile._json.profile_image_url)
               done(null, user)
        }).catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     })
}))