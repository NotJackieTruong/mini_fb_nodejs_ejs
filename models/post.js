const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, max: 100 },
    text: { type: String, required: true, max: 1000 },
    like: { type: Number, required: true },
})

module.exports = mongoose.model('Post', postSchema)