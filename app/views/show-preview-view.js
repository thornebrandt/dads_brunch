var ModelView     = require('./model-view');
var template = require('../templates/show-preview-template');
var ShowModel = require('../models/show-model');

module.exports = ModelView.extend({
    events: {
        "click .showPreview" : "goToSpecificShow"
    },
    getRenderData: function(){
        this.model.formatDate();
        return this.model.toJSON();
    },
    goToSpecificShow: function(e){
        e.preventDefault();
        var urlTitle = $(e.currentTarget).attr("data-title");
        var url =   "shows/" + urlTitle;
        App.router.navigate(url, { trigger: true });
    },
    template: template,
})
