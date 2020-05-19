// models/User.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

let userSchema = new Schema({
    name: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    pseduo: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    photoUrl: {
        type: String
    },
    days_15: {
        type: String
    },
    days_30: {
        type: String
    },
    pay_count: {
        type: String
    },
    pay_cost: {
        type: String
    },
    res_day: {
        type: String
    },
    state: {
        type: Number
    },
    refresh: {
        type: String
    },
    register_time: {
        type: String
    },
    img_state: {
        type: Number
    }
}, {
    collection: 'users'
})
userSchema.plugin(uniqueValidator, { message: 'This account already in use.' });
let User = module.exports = mongoose.model('users', userSchema)