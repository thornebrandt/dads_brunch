var View     = require('./view')
  , template = require('../templates/admin-template')
  , jqueryHelper = require('../helpers/jqueryHelper');

module.exports = View.extend({
    el: "body",
    id: 'app-view',
    template: template,
    events: {
        "click #newShowBtn" : "newShowBtnHandler",
    },

    getRenderData: function(){
        if(App.authorized){
            return { authorized: true }
        }
    },

    initialize: function(){
        jqueryHelper.initialize();
    },

    newShowBtnHandler: function(e){
        e.preventDefault();
        App.router.navigate("admin/shows/new", { trigger: true });
    }

})
