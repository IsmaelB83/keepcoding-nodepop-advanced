'use strict';
// Node imports
const express = require('express');
const https = require('https');
const fs = require('fs');
// Own imports
const database = require('./database');
const server = require('./server');

// Load env variables
require('dotenv').config();

// Connect to MongoDB
database.connectToMongo(process.env.MONGODB_URL)
.then(conn => {
    // Create server application and start server
    const app = server(express(), conn);
    // Prepare https credentials
    const credentials = {
        key: fs.readFileSync(process.env.HTTPS_KEY, 'utf8'),
        cert: fs.readFileSync(process.env.HTTPS_CERT, 'utf8')
    };
    // Start https server
    const appServer = https.createServer(credentials, app);
    appServer.listen(process.env.PORT, () => {
        console.log(`OK - HTTPS server running on port ${process.env.PORT}`);
    });
})
.catch( error => {
    console.log('Error connecting mongodb');
    console.log(error);
});