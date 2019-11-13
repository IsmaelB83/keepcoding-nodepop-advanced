'use strict';
// Node imports
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session')
// Own imports
const { ItemRoutes, UserRoutes, AuthRoutes, WebRoutes } = require('../routes');
const { ErrorMiddleware, SessionAuth } = require('../middlewares');
const i18n = require('../utils/i18n')();
const Config = require('../config');


module.exports = function(app) {
    // View engine settings (ejs)
    app.set('views', path.join(__dirname, '../views'));
    app.set('trust proxy', 1) // trust first proxy
    app.set('view engine', 'ejs');
    // Static files
    app.use(express.static('public'));
    // Middlewares
    app.use(cors());
    app.use(morgan('dev'));
    app.use(express.urlencoded({extended: false}));
    app.use(express.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(cookieParser());
    app.use(i18n.init);
    app.use(session({
        name: 'nodeapi-session',
        secret: Config.secret,
        resave: false,
        saveUninitialized: true,
        cookie: { 
            secure: true, // only send trough https
            maxAge: 1000 * 3600 * 24 * 2 // expire time is 2 days
        }
    }));
    // Routers
    app.use('/', WebRoutes());
    app.use('/apiv1/anuncios', ItemRoutes());
    app.use('/apiv1/authenticate', AuthRoutes());
    app.use('/apiv1/user', UserRoutes());
    app.use(SessionAuth, (req, res, next) => {
        return next({ status: 404, description: 'Not found' })
    });
    // error handler
    app.use(ErrorMiddleware);
    // Retorno la aplicación
    return app;
};
