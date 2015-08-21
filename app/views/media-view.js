var View     = require('./view');
var template = require('../templates/media-template');
var thumbSetTemplate = require('../templates/thumb-set-template');
var PhotoCollection = require('../collections/photo-collection');
var PhotoModel = require('../models/photo-model');


module.exports = View.extend({
    el: "#main",
    thumbs_container: "#thumbs_container",
    template: template,
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
                self.renderPhoto(0);
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
        $(this.thumbs_container).append( thumbSetTemplate() );

        this.photoCollection.each(function(model){
            var $a = $(".mediaThumbLink").eq(i);
            var $img = $a.children("img");
            $a.attr("rel", i);
            $a.removeClass("disabled");
            $img.attr("src", model.get("thumb"));
            i++;
        });

        // this.photoCollection.each(function(model){

        // });
    }
})
