'use strict';
// Node imports
const express = require('express');
const https = require('https');
const fs = require('fs');
const cluster = require('cluster');
// Own imports
const Config = require('./config');
const database = require('./database');
const server = require('./server');
const log = require('./utils/log');


if (cluster.isMaster) {
    
    // cada vez que arranque un fork
    cluster.on('listening', (worker, address) => {
        console.log(`Worker ${worker.id} con pid ${worker.process.pid} is now connected to port ${address.port}`);
        // si quiero recibir mensajes de los workers
        //worker.on('message', (message) => { }); 
    }); 

    // cada vez que un fork se caiga
    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} exited with error code ${code} and signal ${signal}`);
        console.log('Starting a new worker...');
        cluster.fork();
    });
    
    // arranco tantos procesos como nucleos tenga mi equipo
    const numCPUs = require('os').cpus().length;
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
} else {
    // soy un clon, por tanto arranco la aplicación
    const app = server(express());
    initServer(app)
}

// console.log(cluster.workers);

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
                key: fs.readFileSync(Config.key, 'utf8'),
                cert: fs.readFileSync(Config.cert, 'utf8')
            };
        } else {
            credentials = {
                key: fs.readFileSync('./certs/example.com+5-key.pem', 'utf8'),
                cert: fs.readFileSync('./certs/example.com+5.pem', 'utf8')
            };
        }
        server = https.createServer(credentials, app);
        // Arranco el server
        const port = process.env.PORT || Config.port;
        server.listen(port, () => {
            log.info(`OK - HTTPS Server running on port ${port}`);
        });        
    } catch (error) {
        // Error no controlado
        console.log(`Error starting server: ${error.code} ${error.path}`);
        console.log(error);
        process.exit(1);
    }
}