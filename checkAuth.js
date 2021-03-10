// in here we are going to create a middleware function

function checkAuth (req, res, next) {
    // if user is logged in
    if (req.session.user) {
        next()
    } else {
        return res.status(401).render('error', { locals: { error: 'not logged' }})
    }
}

module.exports = checkAuth;