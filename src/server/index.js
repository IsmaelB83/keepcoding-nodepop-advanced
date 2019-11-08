'use strict';
// Node imports
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// Own imports
const { ItemRoutes, UserRoutes, WebRoutes } = require('../routes');
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
    app.use('/', WebRoutes());
    app.use('/apiv1', ItemRoutes());
    app.use('/apiv1/user', UserRoutes());
    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        debugger;
        next(createError(404));
    });
    // error handler
    app.use(ErrorMiddleware);
    // Retorno la aplicación
    return app;
};

/**
 * Chequea si la url de la que proviene el request es de la API o de la Vista 
 * @param {Request} req Request que efectua la llamada al server
 */
function isAPI(req) {
    return req.originalUrl.indexOf('/api') === 0;
}
