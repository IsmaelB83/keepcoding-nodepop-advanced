'use strict';
// Node imports
const express = require('express');
const https = require('https');
const fs = require('fs');
// Own imports
const Config = require('./config');
const database = require('./database');
const server = require('./server');

// Connect to MongoDB
database.connectToMongo(Config.mongodb)
.then(conn => {
    // Create server application and start server
    const app = server(express(), conn);
    // Prepare https credentials
    let credentials;
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
    // Start https server
    const appServer = https.createServer(credentials, app);
    const port = process.env.PORT || Config.port;
    appServer.listen(port, () => {
        console.log(`OK - HTTPS server running on port ${port}`);
    });
})
.catch( error => {
    console.log('Error connecting mongodb');
    console.log(error);
});