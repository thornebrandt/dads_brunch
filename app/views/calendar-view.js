var View     = require('./view');
var ShowPreviewView = require('../views/admin-show-preview-view');
var template = require('../templates/admin-content-template');
var ShowModel = require('../models/show-model');
var ShowCollection = require('../collections/show-collection');

module.exports = View.extend({
    el: "#main",
    template: template,
    afterRender: function(){
        this.setupShowCollection();
    },

    getRenderData: function(){
        this.viewModel = {
            h2: "hey bro"
        }
        return this.viewModel;
    },

    fetchShows: function(){
        this.showCollection = new ShowCollection();
        var self = this;
        this.showCollection.fetch({
            url: BASE_URL + "/shows",
            success: function(data){
                self.renderShowCollection();
            },
            error: function(collection, response){
                console.log("something went wrong getting dudes");
                console.log(response);
            }
        });
    },

    renderShowCollection: function(){
        var self = this;
        this.showCollection.each(function(model){
            $(self.el).append("<div class='showPreviewContainer' id='" + model.get("_id") + "'></div>");
            var showPreviewView = new ShowPreviewView(model);
            showPreviewView.render();
        });
    }
})
