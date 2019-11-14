'use strict';
// Own imports
const { validationResult } = require('express-validator');
// Node imports
const { Item } = require('../../models/');

const ctrl = {};

/**
 * Select adverts from database
 * @param {Request} req Request web
 * @param {Response} res Response web
 * @param {Middleware} next Next middleware
 */
ctrl.select = async (req, res, next) => {
    try {
        // Validaciones
        validationResult(req).throw();
        // Listado
        Item.list(req.query.name, req.query.venta, req.query.tag, req.query.price, parseInt(req.query.limit), 
            parseInt(req.query.skip), req.query.fields, req.query.sort, function(error, results) {
            // Error
            if (error) {
                next({error});
                return;
            }
            // Ok
            res.json({
                success: true,
                count: results.length,
                results: results
            });
        });
    } catch (error) {
        // Los errores de validación de usuario NO me interesa loguerarlos
        if (!error.array) console.log(`Uncontrolled error: ${error}`);
        next(error);
    }
}

/**
 * Select one advert from database
 * @param {Request} req Request web
 * @param {Response} res Response web
 * @param {Middleware} next Next middleware
 */
ctrl.selectOne = async (req, res, next) => {
    try {
        // Validaciones
        validationResult(req).throw();
        let item = await Item.findById(req.params.id);   
        if (item) {
            res.json({
                success: true, 
                result: item
            });
            return;
        }   
        // Si llegamos aquí es que no se ha encontrado un resultado
        next({ status: 404, error: 'Not Found' });
    } catch (error) {
        // Los errores de validación de usuario NO me interesa loguerarlos
        if (!error.array) console.log(`Uncontrolled error: ${error}`);
        next(error);
    }
}

/**
 * Create advert
 * @param {Request} req Request web
 * @param {Response} res Response web
 * @param {Middleware} next Next middleware
 */
ctrl.create = async (req, res, next) => {
    try {
        // Validaciones
        validationResult(req).throw();
        // Nuevo anuncio
        let item = new Item({...req.body});
        if (req.file) {
            item.photo = `/images/anuncios/${req.file.filename}`;
        }
        item = await item.save();
        if (item) {
            res.json({
                success: true, 
                result: item
            });
            return;
        }
        // Si se ha llegado hasta aquí es que no se ha podido insertar
        next({error: 'No se ha podido insertar el anuncio'});
    } catch (error) {
        // Los errores de validación de usuario NO me interesa loguerarlos
        if (!error.array) console.log(`Uncontrolled error: ${error}`);
        next(error);
    }
}

/**
 * Update advert
 * @param {Request} req Request web
 * @param {Response} res Response web
 * @param {Middleware} next Next middleware
 */
ctrl.update = async (req, res, next) => {
    try {
        // Validaciones
        validationResult(req).throw();
        // Actualizo el anuncio y retorno el item actualizado
        let item = await Item.updateItem(req.params.id, new Item({...req.body}));
        if (req.file) {
            item.photo = `/images/anuncios/${req.file.filename}`;
        }
        if (item) {
            res.json({
                success: true,
                result: item
            });
            return;
        }
        // Si llegamos aquí es que no se ha encontrado un resultado
        next({ status: 404, error: 'Not Found' });
    } catch (error) {
        // Los errores de validación de usuario NO me interesa loguerarlos
        if (!error.array) console.log(`Uncontrolled error: ${error}`);
        next(error);
    }
}

/**
 * Get all tags from database
 * @param {Request} req Request web
 * @param {Response} res Response web
 * @param {Middleware} next Next middleware
 */
ctrl.tags = async (req, res, next) => {
    try {
        // Listado
        let results = await Item.find().distinct('tags');
        if (results) {
            res.json({
                success: true,
                count: results.length,
                results: results
            });
            return;
        }
        // Si llegamos aquí es que no se ha encontrado un resultado
        next({ status: 404, error: 'Not Found' });
    } catch (error) {
        // Los errores de validación de usuario NO me interesa loguerarlos
        if (!error.array) console.log(`Uncontrolled error: ${error}`);
        next(error);
    }
}

module.exports = ctrl;