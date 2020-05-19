// models/answer.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let blockuser = new Schema({
    userId: {
        type: Schema.ObjectId,
        ref: 'users'
    },
    blockId: {
        type: Array,
    }
}, {
    collection: 'blockuser'
})

let Blockuser = module.exports = mongoose.model('blockuser', blockuser)