// models/answer.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let answerSchema = new Schema({
    message_id: {
        type: String
    },
    owner: {
        type: Schema.ObjectId,
        ref: 'users'
    },
    client: {
        type: Schema.ObjectId,
        ref: 'users',
    },
    relative: {
        type: String
    },
    answer_state: {
        type: String
    },
    answer: {
        type: Array,
        'default': []
    },
}, {
    collection: 'answerMessage'
})

let Answer = module.exports = mongoose.model('answerMessage', answerSchema)