var View     = require('./view')
  , template = require('../templates/app-template')
  , jqueryHelper = require('../helpers/jqueryHelper')
  , browserHelper = require('../helpers/browserHelper')

module.exports = View.extend({
    el: "body",
    id: 'app-view',
    template: template,
    events: {
        "click #newDudeBtn" : "newDudeBtnHandler",
        "click #allDudesBtn" : "allDudesBtnHandler",
        "click #homeBtn" : "homeBtnHandler"
    },

    getRenderData: function(){
        if(App.authorized){
            return { authorized: true }
        }
    },

    afterRender: function(){
        $("#main_container").removeClass("z500").addClass("z400");
    },

    initialize: function(){
        jqueryHelper.initialize();
        browserHelper();
        this.pubSub();
    },

    newDudeBtnHandler: function(e){
        e.preventDefault();
        App.router.navigate("dudes/new", { trigger: true });
    },

    allDudesBtnHandler: function(e){
        e.preventDefault();
        App.router.navigate("dudes", { trigger: true });
    },

    homeBtnHandler: function(e){
        e.preventDefault();
        App.router.navigate("/", { trigger: true });
    },

    pubSub: function(){
        var self = this;
        this.listenTo(Backbone, "Unauthorized", self.unauthorizedHandler);
    },

    unauthorizedHandler: function(){
        App.error("You are not authorized to edit documents.");
        App.router.navigate("/", { trigger: true });
    }

})