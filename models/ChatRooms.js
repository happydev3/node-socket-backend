// models/ChatRooms.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ChatroomSchema = new Schema({
    userId: {
        type: String
    },
    name: {
        type: String
    },
    useremail: {
        type: String,
    },
    photoUrl: {
        type: String
    },
    message: {
        type: String
    },
    videoLnke: {
        type: String
    },
    sendTime: {
        type: String
    },
    state: {
        type: Number,
        default: 0
    },
    follows: {
        type: Number,
        default: 0
    },
    followers: {
        type: Array
    },
    comments: {
        type: Array
    },
    deActivaters:  {
        type: Array
    }
}, {
    collection: 'chatRooms'
})

module.exports = mongoose.model('ChatRooms', ChatroomSchema)