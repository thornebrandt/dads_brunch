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
        var title = $(e.currentTarget).attr("data-title");
        var date = $(e.currentTarget).attr("data-date");
        var url =   "/shows/" + date + "/" + title;
        App.router.navigate(url, { trigger: true });
    },
    template: template,
})
