'use strict';
// Node imports
const fs = require('fs');
// Own imports
const database = require('./index');
const { Item, User } = require('../models');


// Inicializar base de datos
initDB();

/**
 * Función para inicializar la base de datos y cargar los anuncios predefinidos
 */
async function initDB() {
    try {
        // Conecto a la base de datos
        await database.connectToMongo(process.env.MONGODB_URL);
        // Borro los datos de la colección de anuncion
        await Item.deleteAll();
        await User.deleteAll();
        // Read JSON init data
        const dump = JSON.parse(fs.readFileSync('./src/database/data.json', 'utf8'));
        // Create default user
        for (let i = 0; i < dump.users.length; i++) {
            const user = new User(dump.users[i]);
            await User.insert(user);
        }
        // Create default adverts
        const items = [];
        for (let i = 0; i < dump.anuncios.length; i++) {
            const item = new Item({...dump.anuncios[i]});
            item.thumbnail = item.photo; // Default thumbnail is the original photo
            items.push (item);
        }
        await Item.insertAll(items);
        // Create default user
        console.log(`Database created with ${items.length} adverts and ${dump.users.length} users.`);
        console.log('Please start nodepop with "npm start"');
    } catch (error) {
        // Error no controlado
        console.log('Uncontrolled error.');
        console.log(error);
    }
}