'use strict';
// Node imports
const express = require('express');
const { query, param, body } = require('express-validator');
// Own imports
const { AuthMiddleware } = require('../../middlewares');
const { ItemCtrl } = require('../../controllers');

module.exports = () => {
    const router = express.Router();
    // Rutas de anuncios
    router.get('/', AuthMiddleware, [
        query('name').optional().isLength({min:1, max: 30}).withMessage('value must be between 1 and 30 characteres length'),
        query('skip').optional().isInt({ gt: 0 }).withMessage('must be a number greater than 0'),
        query('limit').optional().isInt({ gt: 0 }).withMessage('must be a number greater than 0'),
        query('price').optional().custom(value => {
            let aux = value.split('-');
            let result = true;
            for (let i = 0; i < aux.length; i++) {
                if (aux[i] && isNaN(+aux[i])) {
                    result = false;
                }
            }
            return result;
        }).withMessage('must be numeric'),
    ], ItemCtrl.select);
    router.get('/:id', AuthMiddleware, [
        param('id').matches(/^[0-9a-fA-F]{24}$/).withMessage('wrong format'),
    ], ItemCtrl.selectOne);
    router.put('/:id', AuthMiddleware, [
        param('id').matches(/^[0-9a-fA-F]{24}$/).withMessage('wrong format'),
        body('name').optional().isLength({min:1, max: 30}).withMessage('value must be between 1 and 30 characteres length'),
        body('description').optional().optional().isLength({min:0, max: 100}).withMessage('length must be between 1 and 100 characters'),
        body('price').optional().isNumeric().withMessage('must be numeric'),
        body('photo').optional().exists().withMessage('is a mandatory field'),
    ], ItemCtrl.update);
    router.post('/', AuthMiddleware, [
        body('name').isLength({min:1, max: 30}).withMessage('value must be between 1 and 30 characteres length'),
        body('description').optional().isLength({min:0, max: 100}).withMessage('length must be between 1 and 100 characters'),
        body('price').isNumeric().withMessage('must be numeric'),
        body('photo').exists().withMessage('is a mandatory field'),
    ], ItemCtrl.create);
    // Rutas de tags
    router.get('/tags', AuthMiddleware, ItemCtrl.tags);
    // Retorno el router
    return router;
}