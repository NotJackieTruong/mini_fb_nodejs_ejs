var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var User = require('../models/user')
var Post = require('../models/post')
var Comment = require('../models/comment')
var Image = require('../models/image')
var request = require('request')
const { ObjectId } = require('mongodb')
var path = require('path')
var fs = require('fs')
var async = require('async')
var jsonPath = path.join(__dirname, '../views/', 'data_json.json')

// home page
router.get('/', function(req, res) {


    async.parallel({
        post_list: function(callback) {
            Post.find().populate([{ path: 'user', model: 'User' }]).exec(callback)
        },
        comment_list: function(callback) {
            Comment.find().populate({ path: 'user', model: 'User' }).exec(callback)
        },
        image_list: function(callback) {
            Image.find().exec(callback)
        }
    }, function(err, result) {
        if (err) return next(err)
        if (result.image_list.length != 0) {

            for (let i in result.image_list) {
                var base64 = result.image_list[i].content
                var imgExt = result.image_list[i].extension
                var userUploadFolder = path.join(__dirname, '../', 'public/uploads/')
                var imgName = result.image_list[i].name + '.' + imgExt
                var imgPath = userUploadFolder + imgName

                fs.writeFile(imgPath, base64, { encoding: 'base64' }, function(err) {
                    if (err) throw err
                    var testJson = {
                        post_id: result.image_list[i].post,
                        image_name: result.image_list[i].name + '.' + result.image_list[i].extension,
                        image_path: '/uploads/' + result.image_list[i].name + '.' + result.image_list[i].extension
                    }

                    fs.readFile(jsonPath, function(err, data) {
                        if (err) throw err

                        var jsonFile = JSON.parse(data)

                        if (jsonFile.length === 0) {
                            jsonFile.push(testJson)
                            fs.writeFile(jsonPath, JSON.stringify(jsonFile), function(err) {
                                if (err) throw err;
                            })

                        } else if (jsonFile.length != 0) {
                            if (!JSON.stringify(jsonFile).includes(JSON.stringify(testJson))) {
                                jsonFile.push(testJson)
                                fs.writeFile(jsonPath, JSON.stringify(jsonFile), function(err) {
                                    if (err) throw err;
                                })
                            } else {
                                console.log(JSON.stringify(jsonFile).includes(JSON.stringify(testJson)))
                            }


                        }
                    })

                })


            }
        }

        var imageInfo
        fs.readFile(jsonPath, 'utf8', function(err, img_result) {
            if (err) {
                throw err;
            }
            if (img_result.length != 0) {
                imageInfo = JSON.parse(img_result)
            }

            res.render('homepage2', { result: result, imageInfo: imageInfo })


        })
    })

})


// test page
router.get('/test', function(req, res, next) {
        res.render('test.ejs')
    })
    // post comment

router.post('/', function(req, res, next) {
    var comment = new Comment({
        post: ObjectId(req.body.postId),
        user: ObjectId("5ebcc775925fcbd70854e080"),
        text: req.body.text
    })
    comment.save((err, result) => {
        if (err) return next(err)
        console.log('result after post: ', result)
        res.redirect('/')
    })

})

router.post('/like', function(req, res) {
    Post.findById(req.body._id, (err, result) => {
        if (err) return next(err)
        result.like = result.like + 1
        result.save()
        res.redirect('/')
    })
})

router.post('/del', function(req, res) {
    Comment.deleteOne({ _id: req.body._id }, (err, result) => {
        if (err) return next(err)
        res.redirect('/')
    })
})

router.post('/create_post', function(req, res) {
    var base64Arr = req.body.image

    var post = new Post({
        user: req.body.userId,
        text: req.body.post,
        like: req.body.like,

    })
    post.save((err) => {
        if (err) throw err;
        for (var i = 0; i < base64Arr.length; i++) {
            // base64 string after encoding images
            var base64String = base64Arr[i]
                // get extension of that image
            var imgExt = base64String.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)[0]
            imgExt = imgExt.split('/')[1]

            // split base64 string after data: image/png; base64,
            base64String = base64String.split(';base64,').pop()
            var imgName = 'image-' + Math.floor((Math.random() * 1000000) + 1)
                // create buffer
                // var bitmap = new Buffer(base64String).toString('base64')

            // create new Image object
            var image = new Image({
                post: post._id,
                name: imgName,
                extension: imgExt,
                content: base64String
            })
            image.save((err) => {
                if (err) throw err

            })

        }

    })
    res.redirect('/')

})

module.exports = router