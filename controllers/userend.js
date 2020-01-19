const User = require('../models/user')
const Course = require('../models/courses')
const Job = require('../models/jobs')
const Test = require('../models/tests')
const Profile = require('../models/profile')
const bcrypt = require('bcryptjs')
const Bug = require('../models/bug')
const TestApplication = require('../models/testapplications')
const CourseApplication = require('../models/courseapplications')
const JobApplication = require('../models/jobapplications')
const Recruiter = require('../models/recruiters')
const TestPaymentData = require('../models/testpaymentdata')
const Keys = require('../config/keys')
const {validationResult} = require('express-validator')
const Certification = require('../models/certification-data')
const Insta = require('instamojo-nodejs')
Insta.setKeys(Keys.Instamojo.API_KEY,Keys.Instamojo.AUTH_KEY)
// Insta.isSandboxMode(true);
//global functions 
function isEmptyObject(obj) {
    return !Object.keys(obj).length;
  }

exports.getIndex = (req,res,next) => {
        res.render('index', {
            docTitle:'Home',
            path:'/'
        })
}
exports.postRecruiter = (req, res, next) => {
    const { name, email, phone, designation, company, profile, description, plan} = req.body;
    const recruiter = new Recruiter({
        name,
        email,
        phone,
        designation,
        company,
        profile,
        description,
        plan
    })
    recruiter.save().then(recruiter => {
        if(plan == 'intern'){
          res.redirect('https://www.instamojo.com/AmcubesIndia/amcubes-intern-plan-21477/')
        } else if(plan =='fulltime'){
          res.redirect('https://www.instamojo.com/AmcubesIndia/amcubes-full-time-plan-03467/')
        } else {
            res.redirect('/recruiter-success')
        }
    }).catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     })
}
exports.getCourses = (req,res,next) => {
    Course.find().sort({_id:-1}).then(courses => {
        res.render('courses', {
            docTitle:'Courses',
            path:'/courses',
            courses:courses
        })
    }).catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     })
}
exports.getCourseById = (req, res, next) => {
    const {courseId} = req.params
    Course.findById(courseId).then(course => {
        if(!course){
            return res.redirect('/notfound')
        }
        res.render('morecourse',{
            docTitle:course.title,
            path:'/courses',
            course
        })
    }).catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     })
}
exports.getJobs = (req,res,next) => {
    const city = req.query.city
    console.log(city)
    Job.find({city}).sort({_id:-1}).then(jobs =>{
        res.render('jobsintern', {
            docTitle:'Jobs',
            path:'/jobs',
            jobs:jobs
        })
    }).catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     })
}

exports.getTests = (req,res,next) => {
    Test.find().sort({_id:-1}).then(tests => {
        res.render('tests', {
            docTitle:'Tests',
            path:'/tests',
            tests:tests
        })
    }).catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     })
}

exports.getRecruiters = (req, res, next) => {
    res.render('recruiters', {
        docTitle:'Recruiters',
        path:'/recruiters',
        recruiterSuccess:false
    })
}
exports.getTestPrep = (req, res, next) => {
    res.render('testprep', {
        docTitle:'Test Preparation',
        path:'/test-preparation',
    })
}

exports.getTermsPrivacy = (req, res, next) => {
    res.render('privacy&terms', {
        docTitle:'Terms & Privacy',
        path:'/terms-privacy'
    })
}
exports.getDashboard = (req,res,next) => {
   User.findById(req.user._id).populate('profile').then(user => {
    Course.find().sort({_id:-1}).then(courses => {
     TestPaymentData.find({buyer_email:req.user.email}).sort({_id:-1}).then(buyer => {
         console.log(buyer)
         if(!buyer.length > 0) {
             console.log('not bought')
             return res.render('dashboard', {
                docTitle:'dashboard',
                path:'/dashboard',
                courses:courses,
                userLogged:user,
                buyerStatus:false
             })
         }
        else {
                res.render('dashboard', {
                    docTitle:'dashboard',
                    path:'/dashboard',
                    courses:courses,
                    userLogged:user,
                    buyer,
                    buyerStatus:true
                })
        } 
     })    
       })
   }).catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     })
}

exports.getProfile = (req,res,next) => {
Profile.findOne({userId:req.session.user._id}).then(profile => {
    if(!profile){
        const profile = new Profile({
            userId:req.session.user._id
        })
         return profile.save().then(result => {
              res.redirect('/profile')
         })
    }
            res.render('profile', {
                docTitle:'Profile',
                path:'/profile',
                profile:profile
            }) 
    }).catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     })
}
exports.postProfile = (req,res,next) => {
   
const { gender, address, dob,
        parentcontact, contact, yearofstudy,
        degree, specialization, collegename,
        tenthpassyear, twelveordippassyear, 
        workedprojectname, projectstartdate, projectenddate, 
        pastjoborinternorg 
      } = req.body;
       
      
Profile.findOne({userId:req.session.user._id}).then(profile => {
    profile.username = req.session.user.username
    profile.email =  req.session.user.email
    profile.contact = req.session.user.contact
    profile.gender = gender
    profile.address = address
    profile.dob = dob
    profile.parentcontact = parentcontact 
    profile.yearofstudy = yearofstudy
    profile.degree = degree
    profile.specialization = specialization
    profile.collegename =  collegename
    profile.tenthpassyear = tenthpassyear
    profile.twelveordippassyear = twelveordippassyear
    profile.workedprojectname = workedprojectname
    profile.projectstartdate = projectstartdate
    profile.projectenddate = projectenddate
    profile.pastjoborinternorg =  pastjoborinternorg
    return profile.save() 
}).then(profile => {
    User.findById(req.user._id).then(user => {
        user.profile = req.profile
        user.save().then(user => {
            res.redirect('/dashboard') 
        })
    })
   
}).catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     })
}
exports.getSettings = (req,res,next) => {
    res.render('moresettings', {
        docTitle:'Settings & More',
        path:'/settings'
    })
}
exports.getBug = (req,res,next) => {
    res.render('bugreport', {
        docTitle:'Bug Report',
        path:'/bugreport',
        success:false
    })
}
exports.postBug = (req,res,next) => {
    const { name, email, bugmessage} = req.body;
     const bug = new Bug({
         name,
         email,
         bugmessage
     })
     bug.save().then(bug => {
        res.render('bugreport', {
            docTitle:'Bug Report',
            path:'/bugreport',
            success:true
        })
     }).catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     })  
}
exports.getAccount = (req,res,next) => {
    let message = req.flash('error')
    if(message.length>0){
        message = message[0]
    } else {
        message = null
    }
    res.render('account', {
        docTitle:'Account',
        path:'/account',
        edit:false,
        errorMessage:message,
        validationErrors:[]
    })
}
exports.postAccount = (req,res,next) => {
    const { username, email, password, contact, userId } = req.body;
    const errors = validationResult(req)
    if(!errors.isEmpty()){
       return res.status(422).render('account', {
        docTitle:'Account',
        path:'/account',
        edit:true,
        errorMessage:errors.array()[0].msg,
        validationErrors:errors.array()
    })
    }
     if(email === req.user.email){
        return User.findOne({email}).then(user => {
            if(password === user.password){
                user.username = username
                user.email = email
                user.password = password
                user.contact = contact
                user.save().then(user => {
                req.session.user = user
                console.log(user)
                return res.redirect('/account')
                }) 
               }
               else {
                bcrypt.hash(password, 12).then(hashedPassword => {
                    user.username = username
                    user.email = email
                    user.password = hashedPassword
                    user.contact = contact
                     return user.save()
                }).then(user => {
                    req.session.user = user
                  console.log(user)
                res.redirect('/account')
           })
               }
        }).catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     })
     }
     else{
       User.findOne({email}).then(user => {
           if(user !== null){
               return res.render('account', {
                docTitle:'Account',
                path:'/account',
                edit:true,
                errorMessage:'Account with that email exists already! please choose another one',
                validationErrors:[]
            })
           }
           User.findOne({_id:userId}).then(nuser => {
               if(password === nuser.password){
                nuser.username = username
                nuser.email = email
                nuser.password = password
                user.contact = contact
                nuser.save().then(user => {
                req.session.user = user
                console.log(user)
                return res.redirect('/account')
                }) 
               }
               else {
                bcrypt.hash(password, 12).then(hashedPassword => {
                    nuser.username = username
                    nuser.email = email
                    nuser.password = hashedPassword
                    user.contact = contact
                     return nuser.save()
                }).then(user => {
                        req.session.user = user
                        console.log(user)
                        res.redirect('/account')
                    })
               }
           
            })
       }).catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     })
     }
}
exports.postGetEditAccount = (req,res,next) => {
    res.render('account', {
        docTitle:'Account',
        path:'/account',
        edit:true,
        errorMessage:null,
        validationErrors:[]
    })
}
exports.postApplyJob = (req, res, next) => {
//   TestApplication.findOne({email:req.session.user.email})
//   .then(testApplication => {
//       console.log(testApplication)
//   if(!testApplication){
//    return res.render('appstatus', {
//         docTitle:'Job Application Status',
//         path:'/jobappfailed'
//     })
//   }
//   if(!testApplication.paid){
//     return res.render('appstatus', {
//         docTitle:'Job Application Status',
//         path:'/jobappfailedpayment'
//     })
//   }
  const { jobId } = req.body;
  Job.findById(jobId).then(job => {
   const jobApplication = new JobApplication({
       username:req.session.user.username,
       email:req.session.user.email,
       contact:req.session.user.contact || req.profile.contact,
       jobTitle:job.title,
       jobCompany:job.company,
       salary:job.salary,
       city:job.city
   })
   return jobApplication.save()
  }).then(jobApp => {
      return res.redirect('https://www.instamojo.com/codemania/amcubes-mock-test-for-interning-abroad-3f15f/')
  }).catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     })
}
exports.postPurchaseCourse = (req, res, next) => {
    TestApplication.findOne({email:req.session.user.email})
  .then(testApplication => {
      console.log(testApplication)
  if(!testApplication){
   return res.render('appstatus', {
        docTitle:'Course Enrollment Status',
        path:'/courseappfailed'
    })
  }
  if(!testApplication.paid){
    return res.render('appstatus', {
        docTitle:'Course Enrollment Status',
        path:'/courseappfailedpayment'
    })
  }
 const { courseId } = req.body;
 Course.findById(courseId)
 .then(course =>{
     
 const courseApplication = new CourseApplication({
    username:req.session.user.username,
    email:req.session.user.email,
    contact:req.session.user.contact || req.profile.contact,
    courseName:course.title,
    coursePrice:course.offerprice
 })
 return courseApplication.save()
 }).then(courseApp => {
    res.render('appstatus', {
        docTitle:'course Application Status',
        path:'/courseappsuccess',
        courseAppid:courseApp._id
    })
 })
 }).catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     })
}
exports.getEnglishCertification = (req, res, next) => {
    res.render('certifications/english',{
        docTitle:'English Certification',
        path:'/english-certification'
    })
}
exports.getTechnicalCertification = (req, res, next) => {
    res.render('certifications/technical',{
        docTitle:'Technical Certification',
        path:'/technical-certification'
    })
}
exports.postCertification = (req, res, next) => {
    const { name, email, phone, college, city, parentphone, certification } = req.body;
    const certif = new Certification({
        name, 
        email,
        phone,
        college,
        city,
        parentphone,
        certification
    })
    certif.save().then(cert => {
        if(cert.certification == 'Full Stack Developer : Java'){
            return res.redirect('https://www.instamojo.com/AmcubesIndia/full-stack-developer-java-certification/')
        } else if(cert.certification == 'React Developer'){
            return res.redirect('https://www.instamojo.com/AmcubesIndia/react-developer-certification-25d65/')
        } else if(cert.certification == 'Python Developer'){
            return res.redirect('https://www.instamojo.com/AmcubesIndia/python-developer-certification-5f32d/')
        } else if(cert.certification == 'Back End Developer : Java + MySQL'){
            return res.redirect('https://www.instamojo.com/AmcubesIndia/back-end-developer-java-mysql-certification/')
        } else if(cert.certification == 'Back End Developer : JavaScript + MongoDB'){
            return res.redirect('https://www.instamojo.com/AmcubesIndia/back-end-developer-javascript-mongodb-certif-1269d/')
        } else if(cert.certification == 'Full Stack Developer : PHP + MySQL'){
            return res.redirect('https://www.instamojo.com/AmcubesIndia/full-stack-developer-php-mysql-certification-a86b2/')
        } else if(cert.certification == 'English Certification'){
            return res.redirect('https://www.instamojo.com/AmcubesIndia/english-certification-1cdb2/')
        } else {
              return res.redirect('/technical-certicication')
        }
    }).catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     })
}
// exports.getResumeBuilding = (req, res, next) => {
//     res.render('certifications/resume-building',{
//         docTitle:'Resume-building',
//         path:'/resume-building'
//     })
// }
exports.postPurchaseTest = (req, res, next) => {
 const { testTime, testId } = req.body
 let testcity, testdate
 Test.findById(testId)
 .then(test =>{
    testcity = test.city
    testdate = test.testdate
    return Profile.findOne({userId:req.user._id})
 })
 .then(profile => {
    if(!profile.degree){
        return res.render('appstatus', {
            docTitle:'Test Application Status',
            path:'/testappfailedprofile'
        })
    }
    else{  
       const testApplication = new TestApplication({
       username: req.session.user.username,
       email:req.session.user.email,
       contact:req.session.user.contact,
       gender:profile.gender,
       dob:profile.dob,
       degree:profile.degree,
       address:profile.address,
       testCity:testcity,
       testDate:testdate,
       testTime:testTime  
     })
       testApplication.save().then(testApp => {
        const data = new Insta.PaymentData();
              data.purpose = 'For Amcubes MockTest Fee Payment'
              data.amount = 999
              data.phone = req.user.contact
              data.buyer_name = req.user.username
              data.setRedirectUrl(`http://amcubes.com/dashboard?user_id=${req.user._id}`)
              data.webhook = 'http://amcubes.com/dashboard'
              data.send_email = true
              data.send_sms = true
              data.email = req.user.email
              data.allow_repeated_payments = true
              
         Insta.createPayment(data, (err, response) => {
             if(!err){
                 const pres = JSON.parse(response)
                if(pres.success){
                    console.log(pres)
                    return res.redirect(pres.payment_request.longurl)
                }
                else {
                    console.log(pres)
                    return res.redirect('/')
                }
             }
             else{
                 console.log(err)
             }
         })
    
    })
    }   
}).catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     })
}
