"use strict";
// Node imports
const jwt = require('jsonwebtoken');
// Own imports
const Config = require('../config'); 

/**
 * Middleware to control authentication
 */ 
module.exports = (req, res, next) => {
    // Auth header is required
    if (!req.headers.authorization) {
        return res.status(401).json({
            status: 404,
            data: 'Not Authorized'
        });
    }
    // Check JWT is expired
    req.token = req.headers.authorization.split(' ')[1];
    const token = jwt.decode(req.token, Config.secret);
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