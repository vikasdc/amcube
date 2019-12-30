module.exports = (req, res,next) => {
    if(!req.session.isGoogleLoggedin || !req.session.isTwitterLoggedin){
        return res.redirect('/login')
    }
    next();
}