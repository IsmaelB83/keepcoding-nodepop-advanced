"use strict";

// Authorization
module.exports = (error, req, res, next) => {
    // Error template
    const jsonError = {
        status: error.status || 500,
        data: error.description || 'Uncontrolled error'
    }
    // Validation errors
    if (error.array) { 
        const errInfo = error.array({ onlyFirstError: true })[0];
        jsonError.status = 422;
        jsonError.data = `Validation failed: ${errInfo.param} ${errInfo.msg}`;
    }
    // status 500 si no se indica lo contrario
    res.status(jsonError.status);
    // Middleware de la API
    if (isAPI(req)) {
        return res.json(jsonError);
    }
    // set locals, only providing error in development
    res.locals.message = jsonError.data;
    res.locals.error = req.app.get('env') === 'development' ? error : {};
    // render the error page
    if (jsonError.status === 404) {
        return res.render('error404');
    }
    res.render('error', {error: jsonError});
};

/**
 * Chequea si la url de la que proviene el request es de la API o de la Vista 
 * @param {Request} req Request que efectua la llamada al server
 */
function isAPI(req) {
    return req.originalUrl.indexOf('/api') === 0;
}
