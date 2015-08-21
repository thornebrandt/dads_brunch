var View     = require('./view');
var template = require('../templates/show-template');
var ShowModel = require('../models/show-model');
var time = require('../helpers/dateHelper');
var PhotoCollection = require('../collections/photo-collection')
var PhotoPreviewView = require('../views/photo-preview-view');

module.exports = View.extend({
    el: "#main",
    template: template,
    afterRender: function(){
        this.fetchPhotos();
    },
    events: {
        'click #backToShows' : 'backToShowsHandler',
        'click #editShowBtn' : 'clickEditShowHandler',
    },
    getRenderData: function(){
        return this.model.toJSON();
    },

    fetchPhotos: function(){
        var show_id = this.model.get("_id");
        this.photoCollection = new PhotoCollection();
        var self = this;
        this.photoCollection.fetch({
            url: BASE_URL + "/photos/show/" + show_id,
            success: function(data){
                self.renderPhotos();
            },
            error: function(collection, response){
                console.log("something went wrong getting photos");
            }
        });
    },

    renderPhotos: function(){
        var self = this;
        this.photoCollection.each(function(model){
            $("#showPhotos").append("<div class='photoPreviewContainer' id='"+model.get("_id")+"'></div>");
            var photoPreviewView = new PhotoPreviewView(model);
            photoPreviewView.render();
        });
        App.appView.checkHeight();

    },

    fetchShow: function(_urlTitle){
        var self = this;
        this.urlTitle = _urlTitle
        var url = BASE_URL + "/show/" + this.urlTitle;
        this.model = new ShowModel();
        this.model.fetch({
            url: url,
            success: function(data, textStatus, options){
                self.model.formatDate();
                self.render();
            },
            error: function(model, e){
                console.log("something went wrong getting a specific show");
                console.log(e.responseText);
            }
        });
    },

    backToShowsHandler: function(e){
        e.preventDefault();
        App.router.navigate("/shows/", { trigger: true });
    },

    clickEditShowHandler: function(e){
        e.preventDefault();
        var url = "admin/shows/" + this.urlTitle + "/edit"
        App.router.navigate(url, { trigger: true });
    },




})
