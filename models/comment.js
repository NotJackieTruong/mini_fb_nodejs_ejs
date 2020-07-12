var mongoose = require('mongoose')
var Schema = mongoose.Schema

var commentSchema = new Schema({
    post: { type: Schema.Types.ObjectId, required: true, ref: 'Post' },
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    text: { type: String, required: true, min: 1 }
})

module.exports = mongoose.model('Comment', commentSchema)