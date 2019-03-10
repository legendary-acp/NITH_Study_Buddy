var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var socket = require('socket.io');
const multer = require('multer');
const fs = require('fs');




app.set('view engine', 'ejs');
mongoose.connect('mongodb://localhost/testAuth');
var db = mongoose.connection;

app.use(bodyParser.urlencoded({ extended: true }))


app.use(bodyParser.json());
app.use('/', require('./routes/api'));
app.use(express.static(__dirname + '/views'));


//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
});


app.use(function (req, res, next) {
    var err = new Error('File Not Found');
    err.status = 404;
    next(err);
  });
  
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
  });


 var server = app.listen(8080, function () {
    console.log('Express app listening on port 3000');
  });



  var io = socket(server);
  io.on('connection', (socket) => {
  
      console.log('made socket connection', socket.id);
  
      // Handle chat event
      socket.on('chat', function(data){
          // console.log(data);
          
          io.sockets.emit('chat', data);
      });
  
      // Handle typing event
      socket.on('typing', function(data){
          socket.broadcast.emit('typing', data);
      });
  
  });