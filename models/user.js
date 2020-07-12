var mongoose = require('mongoose')
var Schema = mongoose.Schema

var userSchema = new Schema({
    name: { type: String, required: true, max: 50, min: 3 },
    age: { type: Number, required: true },

})

module.exports = mongoose.model('User', userSchema)