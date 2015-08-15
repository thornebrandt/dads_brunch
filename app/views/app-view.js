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
        $("#container").scroll(function(){
            var currentScroll = $(this).scrollTop() + $(this).innerHeight();
            var scrollHeight = this.scrollHeight - 2;
            if(currentScroll >= scrollHeight ){
                $("#dogHead").animate({
                    "top" : "0px"
                },
                    600
                );
            }
        });
    },

    scrollFunction: function(){
        console.log("Scrolling");
    },

    initialize: function(){
        jqueryHelper.initialize();
        browserHelper();
        this.pubSub();
        console.log("initialize");
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
