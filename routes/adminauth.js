const express = require('express')
const router = express.Router()
const adminAuth = require('../controllers/adminauth')

router.get('/login', adminAuth.getAdminLogin)
router.post('/login', adminAuth.postAdminLogin)

router.post('/logout', adminAuth.postAdminLogout)

module.exports = router;