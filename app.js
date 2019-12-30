const fs = require('fs');
const http = require('http');
const https = require('https');
const port = process.env.PORT || 80;
const express = require('express')
const bodyParser = require('body-parser')
const app = express();
const mongoose = require('mongoose')
const session = require('express-session')
const mongoDbStore = require('connect-mongodb-session')(session)
const csrf = require('csurf');
const bcrypt = require('bcryptjs')
const AdminUser = require('./models/admin-user')
const userEnd = require('./routes/userend')
const userAuth = require('./routes/userauth')
const adminRoute = require('./routes/adminend.js')
const adminAuth = require('./routes/adminauth')
const User = require('./models/user')
const TestApplication = require('./models/testapplications')
const Profile = require('./models/profile')
const passportSetup = require('./config/passport-setup')
const keys = require('./config/keys')
const passport = require('passport')
const flash = require('connect-flash')
const TestPaymentData = require('./models/testpaymentdata')
const helmet = require('helmet')
const compression = require('compression')
let express_enforces_ssl = require('express-enforces-ssl');
var msg91 = require("msg91")("199545AgnMPBzp6Y5a900e1f", "CDMNIA", "4");
app.use(bodyParser.urlencoded({extended:false}))

// app.enable('trust proxy');
// app.use(express_enforces_ssl());

// const privateKey = fs.readFileSync('/etc/letsencrypt/live/amcubes.com/privkey.pem', 'utf8');
// const certificate = fs.readFileSync('/etc/letsencrypt/live/amcubes.com/cert.pem', 'utf8');
// const ca = fs.readFileSync('/etc/letsencrypt/live/amcubes.com/chain.pem', 'utf8');

// const credentials = {
// 	key: privateKey,
// 	cert: certificate,
// 	ca: ca
// };

const store = new mongoDbStore({
    uri: keys.Mongodb.URI,
    collection:'sessions'
})
app.set('view engine', 'ejs')
app.set('views', 'views')
const session_details = {
    secret:'jscoreismywebsite',
    resave:false, 
    saveUninitialized:true,
    cookie:{
        maxAge:2*30*24*60*60*1000,
        keys:[keys.Session.cookieKey]
    }, 
    store:store
}
app.use(helmet())
app.use(compression())
app.use(session(session_details))
app.use(flash())
// app.use(passport.initialize())
// app.use(passport.session()) 
app.post('/dashboard', (req, res, next) => {
    const { status, payment_id, amount, buyer, buyer_name, buyer_phone, payment_request_id, mac  } = req.body
    if(status == 'Failed' || status == 'Pending'){
      return res.redirect('/');
    }
    else {
        TestApplication.findOne({email:buyer}).then(testApp => {
            testApp.paid = true
            return testApp.save()
        }).then(testApp => { 
            const { testDate, testTime, testCity } = testApp
          const testPaymentData = new TestPaymentData({
              payment_id,
              status,
              amount,
              buyer_email:buyer,
              buyer_name,
              buyer_phone,
              payment_request_id,
              mac,
              testDate,
              testTime,
              testCity
          })
          return testPaymentData.save()
        }).then(testPayment => {
            console.log(req.body)
            console.log(testPayment)
            msg91.send(buyer_phone,`You've made payment of ${amount} to amcubes`, function(err, response){
                console.log(err);
                console.log(response);
            });
            return res.redirect('/dashboard')
        }).catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
         }).catch(err => console.log(err))
    }
})
app.use('/assets', express.static('assets'))
const csrfProtect = csrf();
app.use(csrfProtect)
app.use((req,res,next) => {
    if(!req.session.user){
        return next();
    }
    User.findById(req.session.user._id).then(user => {
        Profile.findOne({userId:req.session.user._id}).then(profile => {
            if(profile){
               req.user = user
               req.profile = profile
               next()
            } else{
                req.user = user;
                next();
            }

        })
     }).catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     })
})
app.use((req,res,next) => {
  res.locals.isLoggedin = req.session.isLoggedin;
  res.locals.isManualLoggedin = req.session.isManualLoggedin
  res.locals.isGoogleLoggedin = req.session.isGoogleLoggedin
  req.session.isTwitterLoggedin = req.session.isTwitterLoggedin
  res.locals.csrfToken = req.csrfToken();
  res.locals.user = req.session.user;
  res.locals.profile = req.profile;
  next();
})
app.use((req,res,next) => {
    AdminUser.findOne({email:'dulgundevikaas1999@gmail.com'}).then(user => {
        if(!user){
           bcrypt.hash('vikas@123',12).then(hashedPass => {
              const adminUser = new AdminUser({
                  username:'vikas',
                  email:'dulgundevikaas1999@gmail.com',
                  password:hashedPass
              })
              return adminUser.save()
           }).then(adminuser => {
              next()
           }) 
        }
        next()
    }).catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     })
  })
app.use((req,res,next) => {
    if(req.session.isAdminLoggedin){
        res.locals.adminUser = req.session.adminUser
        next()
    }
    else{
        next()
    }
})

app.use(userEnd)
app.use(userAuth)
app.use('/admin', adminRoute)
app.use('/admin', adminAuth)
app.get('/500', (req,res,next) => {
    res.status(500)
        .render('errors/500', {
            docTitle:'500 Internal Server Error',
            path:'/500'
        })
})
app.use((req,res,next) => {
    res.status(404)
        .render('errors/404',{
            docTitle:'404 NOT FOUND',
            path:'/404'
        })
})
app.use((error, req, res, next) => {
    // let issue = "An Error Occured In The Amcubes Server Please Check it Out!";

    // var mobileNo =  "8309942409";
    //     msg91.send(mobileNo,issue, function(err, response){
    //         console.log(err);
    //         console.log(response);
    //     });
    res.status(500).render('errors/500', {
        docTitle:'500 ERROR',
        path:'/500'
    })
})
// const httpServer = http.createServer(app);
// const httpsServer = https.createServer(credentials, app);
mongoose.connect(keys.Mongodb.URI, {
    useNewUrlParser:true
}).then(result => {
    app.listen(port, () => {
        console.log('app is listening to port:80')
        console.log('connected to db')
    })
    // console.log('connected to db')
    // httpServer.listen(80, () => {
    //     console.log('HTTP Server running on port 80');
    // });
    
    // httpsServer.listen(443, () => {
    //     console.log('HTTPS Server running on port 443');
    // });
})


