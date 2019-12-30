const User = require('../models/user')
const TestApplication = require('../models/testapplications')
const CourseApplication = require('../models/courseapplications')
const JobApplication = require('../models/jobapplications')
const Course = require('../models/courses')
const Job = require('../models/jobs')
const Test = require('../models/tests')
const Bug = require('../models/bug')
const Recruiter = require('../models/recruiters')
const Testpayment = require('../models/testpaymentdata')
exports.getAdminDashboard = (req, res, next) => {
  let cl, jl, tl, ul, tal, cal, jal, bal, tpl;

    Course.find()
    .then(courses => {  
        cl = courses.length
        return Job.find()
    }).then(jobs => {
        jl = jobs.length
        return Test.find()
    }).then(tests => {
        tl = tests.length
        return User.find()
    }).then(users => {
        ul = users.length
        return TestApplication.find()
    }).then(testApplications => {
        tal = testApplications.length
        return CourseApplication.find()
    }).then(courseApplications => {
        cal = courseApplications.length
        return JobApplication.find()
    }).then(jobApplications => {
        jal = jobApplications.length
        return Testpayment.find()
    }).then(testpay => {
        tpl = testpay.length
        return Bug.find()
    }).then(bugApp => {
        bal = bugApp.length
        return Recruiter.find()
    }).then(recruiter => {
        ral = recruiter.length
        res.render('admin/admindashboard',{
            docTitle:'Dashboard',
            path:'/admin/dashboard',
            courseLength:cl,
            jobLength:jl,
            testLength:tl,
            userLength:ul,
            testApplicationLength: tal,
            courseApplicationLength:cal,
            jobApplicationLength:jal,
            tpl,
            bal,
            ral
        })
    })
    .catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     })
}
exports.getAdminCourses = (req, res, next) => {
    Course.find().sort({_id:-1})
    .then(courses => {
        res.render('admin/admincourses',{
            docTitle:'Courses',
            path:'/admin/courses',
            courses:courses
        })
    })
    .catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     })
}
exports.getAdminCourseById = (req, res, next) => {
    const {courseId} = req.params
    Course.findById(courseId).then(course => {
        if(!course){
            return res.redirect('/notfound')
        }
        res.render('admin/morecourse',{
            docTitle:course.title,
            path:'/courses',
            course
        })
    }).catch(err => {
        res.redirect('/notfound')
    }) 
}
exports.getAdminJobs = (req, res, next) => {
    Job.find().sort({_id:-1})
    .then(job => {
        res.render('admin/adminjobs', {
            docTitle:'Jobs',
            path:'/admin/jobs',
            job:job
        })
    })
    .catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     })
}
exports.getAdminTests = (req, res, next) => {
    Test.find().sort({_id:-1})
    .then(test => {
        res.render('admin/admintests', {
            docTitle:'Tests',
            path:'/admin/tests',
            test:test
        })
    })
    .catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     })
}
exports.getRecruiterApps = (req, res, next) => {
    Recruiter.find().sort({_id:-1})
    .then(recapps => {
        res.render('admin/applications', {
            docTitle:'Recruiter Applications',
            path:'/admin/recruiter-apps',
            recapps   
        })
    })
    .catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     })
}
exports.postDeleteRecruiter = (req, res, next) => {
   Recruiter.findOneAndDelete({_id:req.body.recId})
   .then(recapps => {
       res.redirect('/admin/recruiter-apps')
   })
   .catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     })
}
exports.getAdminUserEnd = (req, res, next) => {
    res.render('admin/adminuserend',{
        docTitle:'View Users',
        path:'/admin/users'
    })
}
exports.getAddCourse = (req, res, next) => {
    res.render('admin/addcontent', {
        docTitle:'Add Course',
        path:'/admin/add-course',
        edit:false
    })
}
exports.getAddJob = (req, res, next) => {
    res.render('admin/addcontent', {
        docTitle:'Add Job',
        path:'/admin/add-job',
        edit:false
    })
}
exports.getUsers = (req, res, next) => {
    User.find().sort({_id:-1})
    .then(users => {
        res.render('admin/users', {
            docTitle:'Manage Users',
            path:'/admin/manage-users',
            users:users
        })
    })
    .catch(err=>console.log(err))
}
exports.postDeleteUsers = (req, res, next) => {
    const {userId} = req.body
    User.findByIdAndRemove(userId)
    .then(user => {
    res.redirect('/admin/reg-users')
    })
    .catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     })
}
exports.getJobApplication = (req, res, next) => {
    JobApplication.find().sort({_id:-1})
    .then(jobApps => {
        res.render('admin/applications', {
            docTitle:'Job Applications',
            path:'/admin/manage-jobapplications',
            jobApps:jobApps   
        })
    })
    .catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     })
}
exports.postDeleteJobApplication = (req, res, next) => {
   JobApplication.findByIdAndRemove(req.body.jobAppId)
   .then(jobApp => {
       res.redirect('/admin/job-applications')
   })
   .catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     })
}
exports.getTestPayments = (req, res, next) => {
   Testpayment.find().sort({_id:-1}).then(testpayments => {
    res.render('admin/applications', {
        docTitle:'Test Payments',
        path:'/admin/test-payments', 
        testpayments 
    })
   }).catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     })
}
exports.postDeleteTestPayment = (req, res, next) => {
    const {testpaymentId} = req.body;
    Testpayment.findByIdAndRemove(testpaymentId).then(testPay => {
       res.redirect('/admin/test-payments')
    }).catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     })
}
exports.getTestApplication = (req, res, next) => {
    TestApplication.find().sort({_id:-1})
    .then(testApps => {
        res.render('admin/applications', {
            docTitle:'test Applications',
            path:'/admin/manage-testapplications', 
            testApps:testApps  
        })
    })
    .catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     })
}
exports.getEditTestApplication = (req, res, next) => {
    const edit = req.query.edit;
    if(!edit){
        return res.redirect('/admin/test-applications')
    }
  const testAppId = req.params.testAppId
  TestApplication.findById(testAppId)
  .then(testApp => {
    res.render('admin/addcontent', {
        docTitle:'Edit Course Application',
        path:'/admin/edit-test-application-payment',
        edit:true,
        testApp:testApp
    })
  })
  .catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     })
}
exports.postEditTestApplication = (req, res, next) => {
    const { testAppId } = req.body;
    TestApplication.findById(testAppId)
    .then(testApp => {
       testApp.paid = true
       testApp.save().then(testApp => {
           res.redirect('/admin/test-applications')
       })
    })
    .catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     })
}
exports.postDeleteTestApplication = (req, res, next) => {
   TestApplication.findByIdAndRemove(req.body.testAppId)
   .then(testApp => {
     res.redirect('/admin/test-applications')
   })
   .catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     })
}
exports.getCourseApplication = (req, res, next) => {
    CourseApplication.find().sort({_id:-1})
    .then(courseApps => {
        res.render('admin/applications', {
            docTitle:'course Applications',
            path:'/admin/manage-courseapplications', 
            courseApps:courseApps  
        })
    })
    .catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     })
}
exports.getEditCourseApplication = (req, res, next) => {
    const edit = req.query.edit
    if(!edit){
        return res.redirect('/admin/course-applications')
    }
    const courseAppId = req.params.courseAppId
    CourseApplication.findById(courseAppId)
    .then(courseApp => {
        res.render('admin/addcontent', {
            docTitle:'Edit Course Application',
            path:'/admin/edit-course-application-payment',
            edit:true,
            courseApp:courseApp
        })
    })
}
exports.postEditCourseApplication = (req, res, next) => {
    const { courseAppId } = req.body;
    CourseApplication.findById(courseAppId)
    .then(courseApp => {
     courseApp.paid = true
     courseApp.save().then(courseApp => {
         res.redirect('/admin/course-applications')
     })
    })
    .catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     })
}
exports.postDeleteCourseApplication = (req, res, next) => {
    const { courseAppId } = req.body
    CourseApplication.findByIdAndRemove(courseAppId)
    .then(courseApp => {
      res.redirect('/admin/course-applications')
    })
    .catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     })
}
exports.getBugApplication = (req, res, next) => {
    Bug.find().sort({_id:-1}).then(bugApps => {
        res.render('admin/applications', {
            docTitle:'Reported Bugs',
            path:'/admin/manage-bugapplications',
            edit:false,
            bugApps:bugApps
        })
    }).catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     })
}
exports.postDeleteBugApplication = (req, res, next) => {
    const { bugAppId } = req.body

    Bug.findByIdAndRemove(bugAppId).then(bug => {

     res.redirect('/admin/bug-report-application')

    }).catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     })
}
exports.getAddTest = (req, res, next) => {
    res.render('admin/addcontent', {
        docTitle:'Add Test',
        path:'/admin/add-test',
        edit:false
    })
}
exports.postAddCourse = (req, res, next) => {
const { title, img, description, offerprice, actualprice } = req.body

 const course = new Course({
     title,
     img,
     description,
     offerprice,
     actualprice
 })
 course.save().then(courses => {
    res.redirect('/admin/courses')
 }).catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     })
}
exports.getEditCourse = (req, res, next) => {    
    const edit = req.query.edit;
    if(!edit){
        return res.redirect('/admin/courses')
    }
    const courseId = req.params.courseId
    Course.findById(courseId).then(course => {
        res.render('admin/addcontent', {
            docTitle:'Edit Course',
            path:'/admin/add-course',
            edit:true,
            course:course
        })  
    }).catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     })
}
exports.postEditCourse = (req, res, next) => {    
  const { title, img, description, offerprice, actualprice, courseId } = req.body;

  Course.findById(courseId).then(course => {
      course.title = title
      course.img = img
      course.description = description
      course.offerprice = offerprice
      course.actualprice = actualprice
      return course.save()
  }).then(course => {
   res.redirect('/admin/courses')
  }).catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     })
}
exports.postDeleteCourse = (req, res, next) => {
    const { courseId } = req.body;
    Course.findByIdAndRemove(courseId).then(result =>{
        res.redirect('/admin/courses')
    }).catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     })
}
//job
exports.postAddJob = (req, res, next) => {
    const { title, company, img, city, salary, lastdate } = req.body
    
     const job = new Job({
         title,
         company,
         img,
         city,
         salary,
         lastdate
     })
     job.save().then(jobs => {
        res.redirect('/admin/jobs')
     }).catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     })
    }
    exports.getEditJob = (req, res, next) => {    
        const edit = req.query.edit;
        if(!edit){
            return res.redirect('/admin/jobs')
        }
        const jobId = req.params.jobId
        Job.findById(jobId).then(job => {
            res.render('admin/addcontent', {
                docTitle:'Edit Job',
                path:'/admin/add-job',
                edit:true,
                job:job
            })
        }).catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     })
    }
    exports.postEditJob = (req, res, next) => {    
        const { title, company, img, city, salary, lastdate, jobId } = req.body
    
      Job.findById(jobId).then(job => {
          job.title = title
          job.company = company
          job.img = img
          job.city = city
          job.salary = salary
          job.lastdate = lastdate
          return job.save()
      }).then(job => {
       res.redirect('/admin/jobs')
      }).catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     })
    }
    exports.postDeleteJob = (req, res, next) => {
        const { jobId } = req.body;
        Job.findByIdAndRemove(jobId).then(result =>{
            res.redirect('/admin/jobs')
        }).catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     })
    }
//test
exports.postAddTest = (req, res, next) => {
    const { city, testdate, time1from, time1to, time2from, time2to, time3from, time3to } = req.body
    
     const test = new Test({
         city,
         testdate,
         time1from,
         time1to, 
         time2from,
         time2to,
         time3from,
         time3to
     })
     test.save().then(tests => {
        res.redirect('/admin/tests')
     }).catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     })
    }
    exports.getEditTest = (req, res, next) => {    
        const edit = req.query.edit;
        if(!edit){
            return res.redirect('/admin/tests')
        }
        const testId = req.params.testId
        Test.findById(testId).then(test => {
            res.render('admin/addcontent', {
                docTitle:'Edit Test',
                path:'/admin/add-test',
                edit:true,
                test:test
            })
        }).catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     })
    }
    exports.postEditTest = (req, res, next) => {    
        const { city, testdate, time1from, time1to, time2from, time2to, time3from, time3to, testId } = req.body
    
      Test.findById(testId).then(test => {
          test.city = city
          test.testdate = testdate
          test.time1from = time1from
          test.time1to = time1to
          test.time2from = time2from
          test.time2to = time2to
          test.time3from = time3from
          test.time3to = time3to
          return test.save()
      }).then(test => {
       res.redirect('/admin/tests')
      }).catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     })
    }
    exports.postDeleteTest = (req, res, next) => {
        const { testId } = req.body;
        Test.findByIdAndRemove(testId).then(result =>{
            res.redirect('/admin/tests')
        }).catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     })
    }
  