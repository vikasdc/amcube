const bcrypt = require('bcryptjs')
const AdminUser = require('../models/admin-user')

exports.getAdminLogin = (req, res, next) => {
    if(req.session.isAdminLoggedin){
       return res.redirect('/admin/dashboard') 
    }
    res.render('admin/adminlogin',{
        docTitle:'Admin Login',
        path:'/adminlogin'
    })
}
exports.postAdminLogin = (req,res,next) => {
    let { email, password } = req.body
    email = email.trim();
    password = password.trim()
    AdminUser.findOne({email})
    .then(adminuser => {
    if(!adminuser){
        return res.redirect('/admin/login')
    }
    return bcrypt.compare(password, adminuser.password)
    .then(hashTRF => {
        if(!hashTRF){
            return res.redirect('/admin/login')
        }
        req.session.isAdminLoggedin = true
        req.session.adminUser = adminuser
        req.session.save((err) => {
            res.redirect('/admin/dashboard')
        })
    })
    }).catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
     })
}
exports.postAdminLogout = (req,res,next) => {
    req.session.destroy(() => {
        res.redirect('/admin/login')
    })
}