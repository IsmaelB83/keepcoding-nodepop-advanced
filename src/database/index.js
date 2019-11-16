'use strict';
// Node imports
const mongoose = require('mongoose');
// Own imports


const database = {
    connectToMongo: async (connection) => {
        // Conecto a la base de datos
        mongoose.set('useCreateIndex', true);
        await mongoose.connect(connection, { 
            useUnifiedTopology: true,
            useNewUrlParser: true 
        });
        return mongoose.connection;
    },
}

module.exports = database;
