'use strict';
// Node imports
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// Own imports
const { ItemRoutes, UserRoutes, AuthRoutes, WebRoutes } = require('../routes');
const { ErrorMiddleware } = require('../middlewares');
const i18n = require('../utils/i18n')();


module.exports = function(app) {
    // View engine settings (ejs)
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'ejs');
    // Internacionalización mediante i18n
    app.use(i18n.init);
    // Static files
    app.use(express.static('public'));
    // Middlewares
    app.use(cors());
    app.use(morgan('dev'));
    app.use(express.urlencoded({extended: false}));
    app.use(express.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(cookieParser());
    // Routers
    app.use('/favicon.ico', (req, res) => res.status(204)); // prevent favicon error while testing api from web browser
    app.use('/', WebRoutes());
    app.use('/apiv1/anuncios', ItemRoutes());
    app.use('/apiv1/authenticate', AuthRoutes());
    app.use('/apiv1/user', UserRoutes());
    app.use((req, res, next) => {
        return next({ status: 404, description: 'Not found' })
    });
    // error handler
    app.use(ErrorMiddleware);
    // Retorno la aplicación
    return app;
};
