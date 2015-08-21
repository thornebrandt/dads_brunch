var dbconfig = require('../../dbconfig');
var moment = require('moment');
var UTC_format = "YYYY-MM-DDTHH:mm:ss";
var db = require('../db');
var fs = require('fs');
var gm = require('gm').subClass({imageMagick: true});


var PhotoModel = require('../models/photo-model.js');


var self = {
    getPhotos: function(req, res){
        var _query = PhotoModel.find().sort( { updated_at: -1 });
        _query.exec(function(err, dudes){
            if(!err){
                res.json(dudes);
            } else {
                return handleError(err);
            }
        });
    },


    getPhotosByShow: function(req, res){
        var show_id = req.params.show_id;
        var query = PhotoModel.find({show_id : show_id }).sort( { updated_at: 1 })
        query.exec(function(err, photos){
            if(!err){
                console.log(photos);
                res.json(photos);
            } else {
                handleError(err);
            }
        });
    },

    getPhoto: function(req, res){
        var id = req.params.id;
        PhotoModel.findById(id, function(err, _model){
            if(!err){
                res.json(_model);
            } else {
                return handleError(err);
            }
        });
    },

    editPhoto: function(req, res){
        if(authenticate(req, res)){
            var id = req.body._id;
            if(req.files && typeof req.files.thumb !== "undefined"){
                self.saveThumb(req, res, self.updatePhoto);
            } else {
                self.updatePhoto(req, res);
            }
        }
    },

    updatePhoto: function(req, res){
        if(authenticate(req, res)){
            var id = req.body._id;
            PhotoModel.findById(id, function(err, model){
                if(!err){
                    model.set(req.body)
                    model.save(function(err){
                        if(err) return handleError(err);
                        res.send(model);
                    });
                } else {
                    return handleError(err);
                }
            });
        }
    },


    deletePhoto: function(req, res){
        if(authenticate(req, res)){
            var id = req.body._id;
            PhotoModel.findById(id, function(err, _model){
                _model.remove(function(err){
                    if(err) return handleError(err);
                    res.send(_model);
                });
            });
        }
    },

    savePhoto: function(req, res){
        if(authenticate(req, res)){
            var photo = new PhotoModel(req.body);
            photo.save(function(err, _model){
                if(!err){
                    res.json(_model);
                } else {
                    return err;
                }
            });
        }
    },



    saveThumb: function(req, res, callback){
        if(authenticate(req, res)){
            var file_string = req.files.thumb.name;
            var file_name = file_string.substr(0, file_string.lastIndexOf('.'));
            var thumb_name = file_name + "_thumb." + req.files.thumb.extension;
            var thumb_path = dbconfig.thumb_path + thumb_name;
            fs.rename(req.files.thumb.path, thumb_path, function(err){
                if(!err){
                    req.body.thumb = dbconfig.upload_path + "thumbs/" + thumb_name;
                    callback(req, res);
                } else {
                    return handleError(err);
                }
            });
        }
    },


    savePhotoAndThumb: function(req, res, callback){
        if(authenticate(req, res)){
            var file_string = req.files.photo.name;
            var file_name = file_string.substr(0, file_string.lastIndexOf('.'));
            var thumb_name = file_name + "_thumb." + req.files.photo.extension;
            gm(req.files.photo.path)
                .resize('100', '100', '^')
                .gravity('Center')
                .crop('100', '100')
                .write(dbconfig.thumb_path + thumb_name, function(err){
                    if(!err){
                        req.body.photo = dbconfig.upload_path + req.files.photo.name;
                        req.body.thumb = dbconfig.upload_path + "/thumbs/" + thumb_name;
                        callback(req, res);
                    } else {
                        console.log("error making thumbnail");
                        console.log(err);
                        return err;
                    }
                });
        }
    },


    postPhoto: function(req, res){
        self.savePhotoAndThumb(req, res, self.savePhoto);
    }

}

module.exports = self;

