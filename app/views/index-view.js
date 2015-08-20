var View     = require('./view');
var template = require('../templates/index-template');
var showTemplate = require('../templates/show-template');
var ShowCollection = require('../collections/show-collection');
var ShowModel = require('../models/show-model');


module.exports = View.extend({
    el: "#main",
    events: {
        "click .currentShow" : "goToCurrentShow",
    },
    currentShowEl: "#currentShow",
    id: 'index-view',
    template: template,

    getRenderData: function(){
        this.model.formatDate();
        return this.model.toJSON();
    },

    fetchCurrentShow: function(){
        var self = this;
        this.model = new ShowModel();
        this.model.fetch({
            url: BASE_URL + "/currentShow",
            success: function(data){
                self.render();
            },
            error: function(e){
                console.log("something went wrong fetching this crap");
            }
        });
    },

    renderCurrentShow: function(){
        console.log(this.model);
        // $(this.currentShowEl).html( this.showTemplate( this.model.toJSON() ));
    },

    goToCurrentShow: function(e){
        e.preventDefault();
        var urlTitle = $(e.currentTarget).attr("data-title");
        var url = "/shows/" + urlTitle;
        App.router.navigate(url, { trigger: true });
    }

})
