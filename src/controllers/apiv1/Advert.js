'use strict';
// Own imports
const { validationResult } = require('express-validator');
// Node imports
const { Item } = require('../../models');
const { jimpConfig } = require('../../utils');


/**
 * Controller object
 */
module.exports = {
    
    /**
     * Select adverts from database
     * @param {Request} req Request web
     * @param {Response} res Response web
     * @param {Middleware} next Next middleware
     */
    select: async (req, res, next) => {
        try {
            // Validations
            validationResult(req).throw();
            // Get Adverts
            Item.list(req.query.name, req.query.venta, req.query.tag, req.query.price, parseInt(req.query.limit), 
                parseInt(req.query.skip), req.query.fields, req.query.sort, function(error, results) {
                if (!error) {
                    // Ok
                    return res.json({
                        success: true,
                        count: results.length,
                        results: results
                    });
                }
                // Error
                next({error});
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Select one advert from database
     * @param {Request} req Request web
     * @param {Response} res Response web
     * @param {Middleware} next Next middleware
     */
    selectOne: async (req, res, next) => {
        try {
            // Validations
            validationResult(req).throw();
            // Get one advert
            let item = await Item.findById(req.params.id);   
            if (item) {
                // Ok
                return res.json({
                    success: true, 
                    result: item
                });
            }   
            // Error
            next({ status: 404, error: 'Not Found' });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Create advert
     * @param {Request} req Request web
     * @param {Response} res Response web
     * @param {Middleware} next Next middleware
     */
    create: async (req, res, next) => {
        try {
            // Validations
            validationResult(req).throw();
            // New Advert
            let item = new Item({...req.body});
            if (req.file) {
                item.photo = `/images/adverts/original/${req.file.filename}`;
                item.thumbnail = item.photo; // Initially thumbnail refers to the same photo
            }
            item = await item.save();
            if (item) {
                // Generate thumbnail
                jimpConfig(item.photo, (thumbnail) => {
                    // Update model
                    item.thumbnail = thumbnail;
                    item.save();
                });
                // Ok
                return res.json({
                    success: true, 
                    result: item
                });
            }
            // Error
            next({error: 'No se ha podido insertar el anuncio'});
        } catch (error) {
            next(error);
        }
    },

    /**
     * Update advert
     * @param {Request} req Request web
     * @param {Response} res Response web
     * @param {Middleware} next Next middleware
     */
    update: async (req, res, next) => {
        try {
            // Validations
            validationResult(req).throw();
            // Update advert
            let item = new Item({...req.body});
            if (req.file) {
                item.photo = `/images/anuncios/${req.file.filename}`;
                item.thumbnail = img.photo; // Initially the thumbnail points to the same photo
            }
            item = await Item.updateItem(req.params.id, item);
            if (item) {
                // Ok
                return res.json({
                    success: true,
                    result: item
                });
            }
            // Error
            next({ status: 404, error: 'Not Found' });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Get all tags from database
     * @param {Request} req Request web
     * @param {Response} res Response web
     * @param {Middleware} next Next middleware
     */
    tags: async (req, res, next) => {
        try {
            // List of tags
            let results = await Item.find().distinct('tags');
            if (results) {
                // Ok
                return res.json({
                    success: true,
                    count: results.length,
                    results: results
                });
            }
            // Error
            next({ status: 404, error: 'Not Found' });
        } catch (error) {
            next(error);
        }
    }
}