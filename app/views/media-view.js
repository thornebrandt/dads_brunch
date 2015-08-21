var View     = require('./view');
var template = require('../templates/media-template');
var photoTemplate = require('../templates/photo-template');
var PhotoCollection = require('../collections/photo-collection');
var PhotoModel = require('../models/photo-model');


module.exports = View.extend({
    el: "#main",
    template: template,
    photoIndex: 0,
    photosPerPage: 12,
    events: {
        "click .mediaThumbLink" : "thumbClickHandler",
    },
    getRenderData: function(){
        this.viewModel = {
            h2: "hey bro"
        }
        return this.viewModel;
    },

    fetchPhotos: function(){
        this.photoCollection = new PhotoCollection();
        var self = this;
        this.photoCollection.fetch({
            url: BASE_URL + "/photos",
            success: function(data){
                self.renderPhotos();
            },
            error: function(collection, response){
                console.log("something went wrong getting dudes");
                console.log(response);
            }
        });
    },

    thumbClickHandler: function(e){
        e.preventDefault();
        var i = $(e.currentTarget).attr("rel");
            this.renderPhoto(i);
    },

    renderPhoto: function(photoIndex){
        var model = this.photoCollection.at(photoIndex);
        if(typeof model !== "undefined"){
            $("#mainShowPhoto").attr("src", model.get("photo"));
        }
        App.appView.scrollToMain();
    },


    renderPhotos: function(){
        var self = this;
        var i = 0;
        this.photoCollection.each(function(model){
            $("#media").append( photoTemplate(model.toJSON() ));
            i++;
        });
        setTimeout(  App.appView.checkHeight,  300 );

    }
})
