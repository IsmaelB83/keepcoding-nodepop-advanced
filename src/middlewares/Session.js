"use strict";

/**
 * Middleware to control authentication
 */ 
module.exports = (req, res, next) => {
    if (req.session.authUser) {
        return next();
    }
    return res.redirect('/user/login');
};