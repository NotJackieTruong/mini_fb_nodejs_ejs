const mongoose = require('mongoose')
const app = require('./app')

const mongoDB = 'mongodb://localhost:27017/test';
mongoose.connect(mongoDB, { useNewUrlParser: true })
mongoose.set('debug', false)
var db = mongoose.connection
db.on('error', (err, message) => {
    console.log('error', err, message);
});
db.on('open', () => {
    console.log('open');
    app.listen(3000, function() {
        console.log("Listening to port 3000")
    })

})