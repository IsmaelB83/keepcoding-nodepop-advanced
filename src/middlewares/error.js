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
    res.json(jsonError);
};