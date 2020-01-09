const express = require('express')
const router = express.Router();
const userEnd = require('../controllers/userend')
const isAuth = require('../middleware/is-auth-user')
const {check} = require('express-validator')

router.get('/', userEnd.getIndex)

router.get('/tests', userEnd.getTests)

router.get('/courses', userEnd.getCourses)
router.get('/courses/:courseId', userEnd.getCourseById)

router.get('/jobs', userEnd.getJobs)

router.get('/recruiters', userEnd.getRecruiters)
router.post('/recruiter', userEnd.postRecruiter)

router.get('/test-preparation', userEnd.getTestPrep)

router.get('/dashboard', isAuth,userEnd.getDashboard)

router.get('/profile', isAuth, userEnd.getProfile)
router.post('/profile-details', isAuth, userEnd.postProfile)

router.get('/settings', isAuth, userEnd.getSettings)

router.get('/account', isAuth, userEnd.getAccount)
router.post('/account', isAuth,[
    check('username','Please enter a name with min 3 chars without numbers and symbols!')
    .isLength({min:3})
    .isAlpha()
    .trim(),
    check('email', 'Please enter a valid email address.')
    .isEmail()
    .normalizeEmail(),
    check('contact', 'Please enter a valid contact number of 10 numbers')
    .isLength({min:10,max:10})
    .isNumeric()
    .trim(),
    check('password', 'Please Enter a Passowrd Containing min 6 Characters Including letters and Numbers')
    .isLength({min:6})
    .trim()
],userEnd.postAccount)

router.post('/edit-account', isAuth, userEnd.postGetEditAccount)

router.get('/bugreport', isAuth, userEnd.getBug)
router.post('/bugreport', isAuth, userEnd.postBug)

router.post('/purchase-test', isAuth, userEnd.postPurchaseTest)

router.post('/purchase-course', isAuth, userEnd.postPurchaseCourse)

router.post('/job-application', isAuth, userEnd.postApplyJob)

router.get('/job-app-success', (req, res, next) => {
    res.render('appstatus', {
        docTitle:'Job Application Status',
        path:'/jobappsuccess'
    })
})
router.get('/english-certification', userEnd.getEnglishCertification)
router.get('/technical-certification', userEnd.getTechnicalCertification)
// router.get('/resume-building', userEnd.getResumeBuilding)
router.post('/certification-course', userEnd.postCertification)
router.get('/thankyounote', (req, res, next) => {
    res.render('thank-you', {
        docTitle:'Thank You',
        path:'/thankyounote'
    })
})
router.get('/terms&privacy', userEnd.getTermsPrivacy)

module.exports = router;