"use strict";
// Node imports
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
// Own imports
const Config = require('../../config');
const { User } = require('../../models');
const Log = require('../../utils/log');

const ctrl = {};

/**
 * Creates a new user in the database. In case the e-mail doest not exist already
 * @param {Request} req Request web
 * @param {Response} res Response web
 * @param {Middleware} next Next middleware
 */
ctrl.create = async (req, res, next) => {
    try {
        // Validations
        validationResult(req).throw();
        // Check first if the email already exists
        let user = await User.findOne({email: req.body.email});
        if (user) {
            // Error
            return next('Error creating user: email already exists');
        }
        // User creation
        user = await User.insert(new User({...req.body}));
        if (user) {
            // Ok
            return res.status(201).json({
                success: true,
                description: 'User created successfully',
            });
        }
        // Error
        next('Error creating user');
    } catch (error) {
        if (!error.array) Log.fatal(`Uncontrolled error: ${error}`);
        next(error);
    }
}

/**
 * Perform application Login trough name/password
 * @param {Request} req Request web
 * @param {Response} res Response web
 * @param {Middleware} next Next middleware
 */
ctrl.login = async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if (user) {
            // Compare hashes (use bcrypt to avoid timing attacks as well)
            if (bcrypt.compareSync(req.body.password, user.password)) {
                // Create the payload and JWT
                const payload = {
                    name: user.name,
                    email: user.email,
                    // JWT expires 60 minutes after login. Then user needs to log again
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
            description: 'No authorized'
        });
    } catch (error) {
        if (!error.array) Log.fatal(`Uncontrolled error: ${error}`);
        next(error);   
    }
}

module.exports = ctrl;