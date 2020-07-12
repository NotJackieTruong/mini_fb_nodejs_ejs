const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ImageSchema = new Schema({
    post: { type: Schema.Types.ObjectId, ref: 'Post' },
    name: { type: String, required: true },
    extension: { type: String, required: true },
    content: { type: String, required: true }
})

module.exports = mongoose.model('Image', ImageSchema)