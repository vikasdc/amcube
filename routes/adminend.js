const express = require('express')
const router = express.Router()
const adminEnd = require('../controllers/adminend')
const isAuth = require('../middleware/is-auth-admin')

router.get('/dashboard', isAuth, adminEnd.getAdminDashboard)

router.get('/courses', isAuth,  adminEnd.getAdminCourses)
router.get('/courses/:courseId', isAuth,  adminEnd.getAdminCourseById)

router.get('/tests', isAuth,  adminEnd.getAdminTests)

router.get('/jobs', isAuth,  adminEnd.getAdminJobs)

router.get('/users', isAuth,  adminEnd.getAdminUserEnd)

router.get('/recruiter-apps', isAuth,  adminEnd.getRecruiterApps)
router.post('/delete-recapp', isAuth,  adminEnd.postDeleteRecruiter)

router.get('/add-course', isAuth, adminEnd.getAddCourse)
router.post('/add-course', isAuth,  adminEnd.postAddCourse)

router.get('/edit-course/:courseId', isAuth, adminEnd.getEditCourse)
router.post('/edit-course/', isAuth,  adminEnd.postEditCourse)

router.post('/delete-course', isAuth,  adminEnd.postDeleteCourse)

router.get('/add-job', isAuth,  adminEnd.getAddJob)
router.post('/add-job', isAuth,  adminEnd.postAddJob)

router.get('/edit-job/:jobId', isAuth, adminEnd.getEditJob)
router.post('/edit-job/', isAuth,  adminEnd.postEditJob)

router.post('/delete-job', isAuth,  adminEnd.postDeleteJob)

router.get('/add-test', isAuth,  adminEnd.getAddTest)
router.post('/add-test', isAuth,  adminEnd.postAddTest)

router.get('/edit-test/:testId', isAuth, adminEnd.getEditTest)
router.post('/edit-test/', isAuth,  adminEnd.postEditTest)

router.post('/delete-test', isAuth,  adminEnd.postDeleteTest)

router.get('/reg-users', isAuth,  adminEnd.getUsers)
router.post('/delete-user', isAuth,  adminEnd.postDeleteUsers)

router.get('/test-applications', isAuth,  adminEnd.getTestApplication)

router.get('/edit-test-application/:testAppId', isAuth, adminEnd.getEditTestApplication)
router.post('/edit-test-application-payment', isAuth, adminEnd.postEditTestApplication)

router.post('/delete-test-application', isAuth,  adminEnd.postDeleteTestApplication)

router.get('/test-payments', isAuth, adminEnd.getTestPayments)
router.post('/delete-test-payment', isAuth, adminEnd.postDeleteTestPayment)

router.get('/job-applications', isAuth,  adminEnd.getJobApplication)

router.get('/cert-data', isAuth,  adminEnd.getCertData)

router.post('/delete-cert-data', isAuth,  adminEnd.postDeleteCertData)

router.post('/delete-job-application', isAuth,  adminEnd.postDeleteJobApplication)

router.get('/course-applications', isAuth,  adminEnd.getCourseApplication)

router.get('/edit-course-application/:courseAppId', isAuth, adminEnd.getEditCourseApplication)
router.post('/edit-course-application-payment', isAuth,  adminEnd.postEditCourseApplication)

router.post('/delete-course-application', isAuth,  adminEnd.postDeleteCourseApplication)

router.get('/bug-report-application', isAuth,  adminEnd.getBugApplication)

router.post('/delete-bug-application', isAuth, adminEnd.postDeleteBugApplication)

module.exports = router;