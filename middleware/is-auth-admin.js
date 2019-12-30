module.exports = (req, res,next) => {
    if(!req.session.isAdminLoggedin){
        return res.redirect('/admin/login')
    }
    next();
}