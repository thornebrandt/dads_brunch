var View     = require('./view');
var ShowPreviewView = require('../views/show-preview-view');
var template = require('../templates/index-template');
var ShowCollection = require('../collections/dude-collection');


module.exports = View.extend({
    el: "#main_container",
    id: 'index-view',
    template: template,
    afterRender: function(){
        this.setupShowCollection();
    },
    setupShowCollection: function(){
        this.showCollection = new ShowCollection();
        var self = this;
        this.showCollection.fetch({
            url: BASE_URL + "/currentShow",
            success: function(data){
                self.renderShowCollection();
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
