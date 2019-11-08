'use strict';
// Node imports
const express = require('express');
const { query, param, body } = require('express-validator');
// Own imports
const { UserCtrl } = require('../../controllers');
const { AuthMiddleware } = require('../../middlewares');


module.exports = () => {
    const router = express.Router();
    // New user account
    router.post('/', [
        body('name').isLength({min:1, max: 30}).withMessage('debe estar entre 1 y 30 carácteres'),
        body('email').isLength({min:3, max: 150}).withMessage('debe estar entre 3 y 150 carácteres'),
        body('password').isLength({min:8, max: 16}).withMessage('debe estar entre 8 y 16 carácteres'),
    ], UserCtrl.create);
    // Login with username/password (it returns the jwt)
    router.post('/login/', [
        body('email').isLength({min:3, max: 150}).withMessage('debe estar entre 3 y 150 carácteres'),
        body('password').isLength({min:8, max: 16}).withMessage('debe estar entre 8 y 16 carácteres'),
    ], UserCtrl.login);
    // Return routes object
    return router;
}