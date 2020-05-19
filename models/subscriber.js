// models/answer.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let subscriber = new Schema({
    userId: {
        type: Schema.ObjectId,
        ref: 'users'
    },
    subscriberId: {
        type: Array,
    }
}, {
    collection: 'subscriber'
})

let Subscriber = module.exports = mongoose.model('subscriber', subscriber)