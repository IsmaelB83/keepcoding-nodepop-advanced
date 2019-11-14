'use strict';
// Node imports
const mongoose = require('mongoose');
// Own imports


const database = {
    connectToMongo: async (connection) => {
                        try {
                            // Conecto a la base de datos
                            mongoose.set('useCreateIndex', true);
                            let db = await mongoose.connect(connection, { 
                                useUnifiedTopology: true,
                                useNewUrlParser: true 
                            });
                            return true;
                        } catch (error) {
                            console.log(`Error connecting to mongodb ${error.errno} ${error.address}:${error.port}.`);
                            return false;
                        }
                    },
}

module.exports = database;
