// models/User.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let userInfoSchema = new Schema({
    userId: {
        type: Schema.ObjectId,
        ref: 'users',
    },
    visitCount: {
        type: Number
    },
    currentState: {
        type: Number,
        default: 0
    }
}, {
    collection: 'userInfo'
})
let UserInfo = module.exports = mongoose.model('userInfo', userInfoSchema)