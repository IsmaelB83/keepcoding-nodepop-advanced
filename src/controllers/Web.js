'use strict';
// Node imports
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt-nodejs');
const moment = require('moment');
// Own imports
const { Item, User } = require('../models');


const ctrl = {};


ctrl.index = async (req, res, next) => {
    // Validaciones
    validationResult(req).throw();
    // Busco los anuncios en Mongo
    Item.list(req.query.name, req.query.venta, req.query.tag, req.query.price, parseInt(req.query.limit),
        parseInt(req.query.skip), req.query.fields, req.query.sort, function(error, results) {
        // Error
        if (error) {
            return next({error});
        } 
        // Ok
        res.render('pages/index',  {
            success: true,
            count: results.length,
            results: results,
            moment: moment,
            userName: req.session.authUser.name
        });
    });
}

ctrl.detail = async (req, res, next) => {
    // Validaciones
    validationResult(req).throw();
    // Busco el anuncio por ID
    let result = await Item.findById(req.params.id);
    if (result) {
        return res.render('pages/detail',  {
            success: true,
            result: result,
            moment: moment
        });
    }
    // Si llego aquí es que no se encontró nada
    res.render('pages/error404')
}

ctrl.addAdvert = async (req, res, next) => {
    res.render('pages/add')
}

ctrl.changeLocale = async (req, res, next) => {
    // Get locale and url to redirect after changing the locale
    const locale = req.params.locale;
    const backTo = req.get('referer');
    // Set cookie for locale preferences
    res.cookie('nodepop-locale', locale, {maxAge: 1000 * 3600 * 24 * 20});
    // Redirect
    res.redirect(backTo);
}

ctrl.formLogin = async (req, res, next) => {
    res.render('pages/login');
}

ctrl.postLogin = async (req, res, next) => {
    // Get user credentials from form
    const password = req.body.password;
    const email = req.body.email
    // Find user in mongo
    const user = await User.findOne({email: email});
    if (user) {
        // Compare hashes (use bcrypt to avoid timing attacks as well)
        if (bcrypt.compareSync(password, user.password)) {
            req.session.authUser = {
                id: user._id,
                name: user.name,
                email: user.email,
            }
            return res.redirect('/');
        }
    }
    // Authorization error
    res.locals.status = 401;
    res.locals.email = email;
    res.locals.error = res.__('Not authorized');
    res.render('pages/login');
}

ctrl.logout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
}

module.exports = ctrl;