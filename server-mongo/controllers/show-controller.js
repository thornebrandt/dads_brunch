var dbconfig = require('../../dbconfig');
var ShowModel = require('../models/show-model.js');
var moment = require('moment');
var UTC_format = "YYYY-MM-DDTHH:mm:ss";
var db = require('../db');
var fs = require('fs');
var gm = require('gm').subClass({imageMagick: true});

var self = {

    getAll: function(req, res){
        var _query = ShowModel.find().sort( { date: 1 });
        _query.exec(function(err, models){
            if(!err){
                res.json(models);
            } else {
                return handleError(err);
            }
        });
    },

    getActive: function(req, res){
        var _query = ShowModel.find({ active: true }).sort( { date: -1 });
        _query.exec(function(err, models){
            if(!err){
                res.json(models);
            } else {
                return handleError(err);
            }
        });
    },

    getCurrentShow: function(req, res){
        var _query = ShowModel.findOne({ date: { $gte: new Date() }}).sort( { date: 1 });
        _query.exec(function(err, model){
            if(!err){
                if(model){
                    res.json(model);
                } else {
                    self.getPastShow(req, res);
                }
            } else {
                handleError(err);
            }
        });
    },

    getShow: function(req, res){
        var urlTitle = req.params.urlTitle;
        var query = ShowModel.findOne({
            urlTitle: {
                $eq: urlTitle
            }
        });
        query.exec(function(err, show){
            if(!err){
                res.json(show);
            } else {
                return handleError(err);
            }
        });
    },

    getPastShow: function(req, res){
        var _query = ShowModel.findOne({ date: { $lt: new Date() }}).sort( { date: -1 });
        _query.exec(function(err, model){
            if(!err){
                if(model){
                    res.json(model);
                }
            } else {
                handleError(err);
            }
        });
    },

    createShow: function(req, res){
        if(authenticate(req, res)){
            self.savePhotoAndThumb(req, res, self.saveShow);
        }
    },


    editShow: function(req, res){
        if(authenticate(req, res)){
            var id = req.body._id;
            if(req.files && typeof req.files.photo !== "undefined"){
                self.savePhotoAndThumb(req, res, self.updateShow) ;
            } else if(req.files && typeof req.files.thumb !== "undefined"){
                self.saveThumb(req, res, self.updateShow);
            } else {
                self.updateShow(req, res);
            }
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


    saveShow: function(req, res){
        if(authenticate(req, res)){
            var show = new ShowModel(req.body);
            show.save(function(err, _model){
                if(!err){
                    res.json(_model);
                } else {
                    return err;
                }
            });
        }
    },


    updateShow: function(req, res){
        if(authenticate(req, res)){
            var id = req.body._id;
            ShowModel.findById(id, function(err, show){
                if(!err){
                    show.set(req.body)
                    show.save(function(err){
                        if(err) return handleError(err);
                        res.send(show);
                    });
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
                        req.body.thumb = dbconfig.upload_path + "thumbs/" + thumb_name;
                        callback(req, res);
                    } else {
                        console.log("error making thumbnail");
                        console.log(err);
                        return err;
                    }
                });
        }
    },


    deleteShow: function(req, res){
        if(authenticate(req, res)){
            console.log("deleting show");
            var id = req.body._id;
            ShowModel.findById(id, function(err, show){
                show.remove(function(err){
                    if(err) return handleError(err);
                    res.send(show);
                });
            });
        }
    },



}

module.exports = self;


