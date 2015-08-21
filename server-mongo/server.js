var express = require('express'),
    request = require('request'),
    fs = require('fs'),
    cors = require('cors'),
    dbconfig = require('../dbconfig'),
    bodyParser = require('body-parser'),
    multer = require('multer')


var db = require('./db');
var showController = require('./controllers/show-controller');
var photoController = require('./controllers/photo-controller');

var app = express();
app.use('/', express.static(__dirname + '/'));
app.use(express.static(__dirname + dbconfig.public_path));
app.use(cors());



var multerOptions = {
    dest: 'public/uploads',
    rename: function(fieldname, filename){
        return "" + Date.now() + "_" +  filename;
    },
    onFileUploadStart: function(file){
        if(
            file.mimetype !== 'image/png' &&
            file.mimetype !== 'image/jpg' &&
            file.mimetype !== 'image/jpeg' &&
            file.mimetype !== 'images/gif'
        ){
            return false;
        }
    },
    onFileUploadComplete: function(file){
        console.log(file.fieldname + ' was uploaded to ' + file.path);
        done = true;
    }
}


app.use(multer(multerOptions));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


//shows


app.get('/currentShow', showController.getCurrentShow);
app.get('/show/:urlTitle', showController.getShow);
app.get('/shows', showController.getAll);
app.delete('/show', showController.deleteShow);
app.post('/shows/new', showController.createShow);
app.patch('/shows/edit', showController.editShow);


//end-dudes

//photos
app.get('/photos/show/:show_id', photoController.getPhotosByShow);
app.get('/photos/:id', photoController.getPhoto);
app.get("/photos", photoController.getPhotos);
app.post('/photos', photoController.postPhoto);
app.delete('/photos/:id', photoController.deletePhoto);
app.patch('/photos/edit', photoController.editPhoto);




var server = app.listen(dbconfig.PORT_NUMBER, function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log('app listening on http://%s:%s', host, port);
});

