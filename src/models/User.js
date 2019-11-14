"use strict";
// Node imports
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');


// User
const UserSchema = new Schema(
    {   /**
         * User name
         */
        name: { type: String, required: true, maxlength: 30 },
        /**
         * User email
         */
        email: { type: String, required: true, maxlength: 150, unique: true },
        /**
         * Encrypted password
         */
        password: { type: String, required: true, minlength: 4 },
        /**
         * JSON Web Token to authenticate in the API
         */
        jwt: { type: String },
        /**
         * Expiration time of the JWT
         */
        expire: { type: Date, default: Date.now() + 3600000, select: false },
    },
    {
        timestamps: true, 
    }
);

/**
* Función estática para crear un usuario
* @param {User} user Usuario a crear en mongo
*/
UserSchema.statics.insert = async function(user) {
    try {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
        return await user.save();
    } catch (error) {
        console.log('Error insertando usuarios.');
        console.log(error);
        return false;
    }
};

/**
* Función estática para actualizar los datos de un usuario
* @param {String} id ID que representa a un usario en MongoDB
* @param {User} newUser Objeto con los datos a modificar
*/
UserSchema.statics.update = async function(id, newUser) {
    try {
        let oldUser = await User.findById(id);
        if (oldUser) {
            oldUser.name = newUser.name || oldUser.name;
            oldUser.email = newUser.email || oldUser.email;
            return await oldUser.save();
        }
        return false;
    } catch (error) {
        console.log('Error actualizando usuario.');
        console.log(error);
        return false;
    }
};

/**
* Función estática para eliminar todos los usuarios
*/
UserSchema.statics.deleteAll = async function() {
    try {
        await User.deleteMany({});
    } catch (error) {
        // Error no controlado
        console.log('Error while deleting users.');
        console.log(error);
    }
};

const User = mongoose.model('User', UserSchema);
module.exports = User;