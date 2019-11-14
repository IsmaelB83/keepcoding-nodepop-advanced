"use strict";
// Node imports
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
// Own imports
const Config = require('../../config');
const { User } = require('../../models');

const ctrl = {};

/**
 * Perform application Login trough username/password
 * @param {Request} req Request web
 * @param {Response} res Response web
 * @param {Middleware} next Next middleware
 */
ctrl.login = async (req, res, next) => {
    // Find user by email
    const user = await User.findOne({email: req.body.email});
    if (user) {
        // Compare hashes (use bcrypt to avoid timing attacks as well)
        if (bcrypt.compareSync(req.body.password, user.password)) {
            // Create the payload and JWT (expiration in 60 minutes after login)
            const payload = {
                name: user.name,
                email: user.email,
                expires: moment().add(60, 'minutes')
            };
            const jwtoken = jwt.sign({payload}, Config.secret);
            user.jwt = jwtoken;
            // Save JWT in the database
            user.save();
            // Return the JWT and user information
            return res.json({
                success: true,
                description: 'Authorization successful',
                user: {
                    name: user.name,
                    email: user.email,
                    token: user.jwt,
                },
            });
        }
    }
    // Unauthorized
    return next({
        status: 401,
        description: 'Not authorized'
    });
}

module.exports = ctrl;