'use strict';
// Node imports
const mongoose = require('mongoose');
// Own imports
const log = require('../utils/log');

const database = {
    connectToMongo: async (connection) => {
                        try {
                            // Conecto a la base de datos
                            mongoose.set('useCreateIndex', true);
                            let db = await mongoose.connect(connection, { useNewUrlParser: true });
                            log.info(`Connected to mongodb ${db.connection.host}:${db.connection.port}/${db.connection.name}.`);
                            return true;
                        } catch (error) {
                            log.fatal(`Error connecting to mongodb ${error.errno} ${error.address}:${error.port}.`);
                            return false;
                        }
                    },
}

module.exports = database;
