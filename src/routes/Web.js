'use strict';
// Node imports
const express = require('express');
const { query, param } = require('express-validator');
// Own imports
const { WebCtrl } = require('../controllers');

module.exports = () => {
    const router = express.Router();
    // Obtener y filtrar sobre el listado de anuncios
    router.get('/', [
        query('name').optional().isLength({min:1, max: 30}).withMessage('value must be between 1 and 30 characteres length'),
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
        query('skip').optional().isInt({ gt: 0 }).withMessage('must be a number greater than 0'),
        query('limit').optional().isInt({ gt: 0 }).withMessage('must be a number greater than 0')
    ], WebCtrl.index); 
    // Add Advert
    router.get('/advert/add', (req, res, next) => res.render('pages/addAdvert'));
    // Obtener un anuncio por su ID
    router.get('/advert/:id', [
        param('id').matches(/^[0-9a-fA-F]{24}$/).withMessage('wrong format'),
    ], WebCtrl.detail);
    // Login
    router.get('/login', (req, res, next) => res.render('pages/login'));
    // Retorno el router
    return router;
}