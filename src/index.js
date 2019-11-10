'use strict';
// Node imports
const express = require('express');
const https = require('https');
const fs = require('fs');
// Own imports
const Config = require('./config');
const database = require('./database');
const server = require('./server');
const log = require('./utils/log');

// Crear aplicación express y arrancar el server
const app = server(express());
initServer(app)

/**
 * Función asincrona para inicializar el servidor
 */
async function initServer(app) {
    try {
        // Conectar a BD
        let connected = await database.connectToMongo(Config.mongodb);
        if (connected === false) {
            log.fatal('Error connecting mongodb');
            process.exit(1);
        }
        // Si se conecta a mongo se continua con la inicialización del server express
        let server, credentials = {};
        if (process.env.NODE_ENV === 'production') {
            credentials = {
                key: fs.readFileSync(Config.prod.key, 'utf8'),
                cert: fs.readFileSync(Config.prod.cert, 'utf8')
            };
        } else {
            credentials = {
                key: fs.readFileSync(Config.dev.key, 'utf8'),
                cert: fs.readFileSync(Config.dev.cert, 'utf8')
            };
        }
        server = https.createServer(credentials, app);
        // Arranco el server
        const port = process.env.PORT || Config.port;
        server.listen(port, () => {
            log.info(`OK - HTTPS server running on port ${port}`);
        });        
    } catch (error) {
        // Error no controlado
        console.log(`Error starting server: ${error.code} ${error.path}`);
        console.log(error);
        process.exit(1);
    }
}