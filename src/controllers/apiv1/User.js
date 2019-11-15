"use strict";
// Node imports
const { validationResult } = require('express-validator');
// Own imports
const { User } = require('../../models');


/**
 * Controller object
 */
module.exports = {

    /**
     * Creates a new user in the database. In case the e-mail doest not exist already
     * @param {Request} req Request web
     * @param {Response} res Response web
     * @param {Middleware} next Next middleware
     */
    create: async (req, res, next) => {
        try {
            // Validations
            validationResult(req).throw();
            // Check first if the email already exists
            let user = await User.findOne({email: req.body.email});
            if (user) {
                // Error
                return next({
                    status: 400,
                    description: 'Error creating user: email already exists'
                });
            }
            // User creation
            user = await User.insert(new User({...req.body}));
            if (user) {
                // Ok
                return res.status(201).json({
                    description: 'User created successfully',
                    user: {
                        id: user._doc._id,
                        name: user._doc.name,
                        email: user._doc.email
                    }
                });
            }
            // Error
            next({
                status: 400,
                description: 'Error creating user'
            });
        } catch (error) {
            if (!error.array) console.log(`Uncontrolled error: ${error}`);
            next(error);
        }
    },
}