const express = require('express')
const app = express()
var path = require('path')
var indexRouter = require('./routes/index')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var fs = require('fs')
    // view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/uploads/')))


fs.readFile(path.join(__dirname, 'views', '/data_json.json'), function(err, data) {
        if (err) throw err
        if (data.length == 0) {
            fs.writeFile(path.join(__dirname, 'views', '/data_json.json'), '[]', function(err) {
                if (err) throw err;
            })
        }
    })
    // use router
app.use('/', indexRouter)
app.use(express.json())

app.use(bodyParser.json())

module.exports = app