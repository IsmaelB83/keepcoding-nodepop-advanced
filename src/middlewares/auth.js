"use strict";
// Node imports
const jwt = require('jsonwebtoken');
const moment = require('moment');
// Own imports
const Config = require('../config'); 

/**
 * Middleware to control authentication
 */
module.exports = (req, res, next) => {
    try {
        // Auth header is required
        if (!req.headers.authorization) throw 'Forbidden';
        // Check JWT is expired
        req.token = req.headers.authorization.split(' ')[1];
        const token = jwt.decode(req.token, Config.secret);
        const now = new Date();
        const expire = new Date(token.payload.expires);
        if (now.getTime() >= expire.getTime()) {
            throw 'Token expired';
        }
        // User authenticated continue with next middleware
        req.user = token.payload;
        next();
    } catch (error) {
        // Unauthorized
        return res.status(401).json({
            status: 404,
            data: `Not Authorized: ${error}`
        });
    }
};