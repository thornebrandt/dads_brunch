//makes the mongo connection and listens for errors and crap

var dbconfig = require('../dbconfig');
var mongoose = require('mongoose');

var dbURI = dbconfig.dbURI;

mongoose.connect(dbURI);

mongoose.connection.on('connected', function () {
  console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('error',function (err) {
  console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
  console.log('Mongoose disconnected');
});

process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected through app termination');
    process.exit(0);
  });
});

authenticate = function(req, res){
    if(req.headers.password === dbconfig.auth_token){
        return true;
    } else {
        res.send(401);
        return false;
    }
}
