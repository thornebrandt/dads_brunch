var View     = require('./view');
var ShowPreviewView = require('../views/show-preview-view');
var template = require('../templates/admin-content-template');
var ShowModel = require('../models/show-model');
var DudeCollection = require('../collections/show-collection');

module.exports = View.extend({
    el: "#admin_content",
    template: template,
    afterRender: function(){
        this.setupDudeCollection();
    },

    getRenderData: function(){
        this.viewModel = {
            h2: "hey bro"
        }
        return this.viewModel;
    },

    setupDudeCollection: function(){
        this.dudeCollection = new DudeCollection();
        var self = this;
        this.dudeCollection.fetch({
            url: BASE_URL + "/shows",
            success: function(data){
                self.renderDudeCollection();
            },
            error: function(collection, response){
                console.log("something went wrong getting dudes");
                console.log(response);
            }
        });
    },
    renderDudeCollection: function(){
        var self = this;
        this.dudeCollection.each(function(model){
            $(self.el).append("<div class='dudePreviewContainer' id='" + model.get("_id") + "'></div>");
            var showPreviewView = new ShowPreviewView(model);
            showPreviewView.render();
        });
    }
})
