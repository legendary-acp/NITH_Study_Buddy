var express = require('express');
var router = express.Router();
var User = require('../models/usermodel');
var File = require('../models/chatmodel');
var socket = require('socket.io');
const multer = require('multer');
const fs = require('fs');

var storage = multer.diskStorage({
	destination : "uploads",
	filename    : function(req, file, cb){
        cb(null , file.fieldname + ".pdf");
	}
});

var upload = multer({storage : storage});


router.get('/', function(req, res, next){
    res.render('Sign_up');
});



router.post('/', function(req, res, next){
    if(req.body.password !== req.body.passwordConf){
        var err = new Error('Password do not match');
        err.status = 400;
        res.send("Password dont match");
        return next(err);
    }
    if(req.body.email &&
        req.body.name &&
        req.body.roll &&
        req.body.password &&
        req.body.passwordConf &&
        req.body.branch &&
        req.body.phone
        ){
            var userData = {
                name : req.body.name,
                roll : req.body.roll,
                email : req.body.email,
                phone : req.body.phone,
                branch : req.body.branch,
                password : req.body.password        
                }
                User.create(userData, function(error, user){
                    if(error){
                        return next(error);
                    } else {
                        url = 'profile' + '?userId=' + user._id;
                      console.log(url);
                    return res.redirect(url);
                    }
                });
            } else if (req.body.logemail && req.body.logpassword) {
                User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
                  if (error || !user) {
                    var err = new Error('Wrong email or password.');
                    err.status = 401;
                    return next(err);
                  } else {
                      url = 'profile' + '?userId=' + user._id;
                      console.log(url);
                    return res.redirect(url);
                  }
                });
              } else {
                var err = new Error('All fields required.');
                err.status = 400;
            return next(err);
            }
});


router.get('/profile', function(req, res, next){
    console.log(req.query.userId)
    User.findById(req.query.userId)
    .exec(function(error, user){
        if(error){
            return next(error);
        }
        else{
            if(user === null){
                var err = new Error('Hmmm Not allowed');
                err.status = 400;
                return next(err);
            }else{
                url = 'chat' + '?userId=' + user._id;
                console.log(url);
                res.render('index', {user : user});
            }
        }
    });
});

router.get('/upload', (req, res) => {
    File.find({}, function(err, files){
        res.render('upload', {files : files});
        fs.readFile(files[13].filename, function read(err, data) {
            if (err) {
                throw err;
            }
            content = data;
        
            console.log(content);   
            processFile();          
        });
        
        function processFile() {
            console.log(content);
        }
    })
  });

  router.post('/upload', upload.single("uploaded"), (req, res) => {
    File.create({
        title : req.body.title,
        filename : req.file.path,
        description : req.body.description
    }, function(err, foundBlog){
        if(err)
            console.log(err);
        else{
            foundBlog.save();
            res.redirect("/upload");
        }
});
  });

router.get('/names', function(req, res){
    User.find({}, function(err, users){
        res.send(users);
    })
})

 router.get('/chat', function(req, res){
        res.render('chatindex');

 });


router.get('/logout', function (req, res, next) {
       
          return res.redirect('/');
    
  });

module.exports = router;