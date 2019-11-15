"use strict";
// Node imports
const jwt = require('jsonwebtoken');
// Own imports

/**
 * Middleware to control authentication
 */ 
module.exports = (req, res, next) => {
    // Session authentication (web)
    if (!isAPI(req)) {
        if (req.session.authUser) {
            return next();
        }
        return res.redirect('/user/login');
    }
    // JWT Authentication (API)
    if (!req.headers.authorization) {
        return res.status(401).json({
            status: 404,
            data: 'Not Authorized'
        });
    }
    // Check JWT is expired
    req.token = req.headers.authorization.split(' ')[1];
    const token = jwt.decode(req.token, process.env.SECRET);
    const now = new Date();
    const expire = new Date(token.payload.expires);
    if (now.getTime() >= expire.getTime()) {
        return res.status(401).json({
            status: 404,
            data: 'Not Authorized'
        });
    }
    // User authenticated continue with next middleware
    req.user = token.payload;
    next();
};

/**
 * Check if URL provides from a request from the API or the Web 
 * @param {Request} req Request
 */
function isAPI(req) {
    return req.originalUrl.indexOf('/api') === 0;
}