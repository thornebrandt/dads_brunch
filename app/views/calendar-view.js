var View     = require('./view');
var ShowPreviewView = require('../views/show-preview-view');
var template = require('../templates/calendar-template');
var ShowModel = require('../models/show-model');
var ShowCollection = require('../collections/show-collection');

module.exports = View.extend({
    el: "#main",
    futureEl: '#upcomingShows',
    pastEl: '#pastShows',
    template: template,
    getRenderData: function(){
        this.viewModel = {
            h2: "hey bro"
        }
        return this.viewModel;
    },

    fetchShows: function(){
        this.futureCollection = new ShowCollection();
        var self = this;
        this.futureCollection.fetch({
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
        this.futureCollection.each(function(model){
            model.formatDate();
            var showPreviewView = new ShowPreviewView(model);
            var previewString = "<div class='showPreviewContainer' id='" + model.get("_id") + "'></div>";
            if(model.get("isFuture")){
                $(self.futureEl).append(previewString);
            }else{
                $(self.pastEl).prepend(previewString);
            }
            showPreviewView.render();
        });
    }
})
