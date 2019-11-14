'use strict';
// Node imports
const express = require('express');
// Own imports
const { WebUserCtrl } = require('../controllers');
const { SessionAuth } = require('../middlewares');


module.exports = () => {

    // Create express router
    const router = express.Router();
    
    /**
     * Change language of the webapp
     */
    router.get(
        '/change-locale/:locale', 
        SessionAuth, 
        WebUserCtrl.changeLocale);
    /**
     * Logout session
     */
    router.get(
        '/logout', 
        SessionAuth,
        WebUserCtrl.logout);
    /**
     * Tender login form
     */
    router.get(
        '/login', 
        WebUserCtrl.formLogin);
    /**
     * Login session
     */
    router.post(
        '/login', 
        WebUserCtrl.postLogin);
    
    // Return router
    return router;
}