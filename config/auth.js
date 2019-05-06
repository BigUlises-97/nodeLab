module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'Inicia sesión para continuar');
        res.redirect('/users/login');
    }
}