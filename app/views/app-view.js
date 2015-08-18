var View     = require('./view')
  , template = require('../templates/app-template')
  , jqueryHelper = require('../helpers/jqueryHelper')
  , browserHelper = require('../helpers/browserHelper')

module.exports = View.extend({
    el: "body",
    id: 'app-view',
    containerEl: "#main_container",
    template: template,
    mobileMenu: false,
    events: {
        "click #newDudeBtn" : "newDudeBtnHandler",
        "click #allDudesBtn" : "allDudesBtnHandler",
        "click #mobile_logo" : "mobileLogoHandler",
        "click #mobile_menu_btn": "mobileMenuBtnHandler"
    },

    getRenderData: function(){
        if(App.authorized){
            return { authorized: true }
        }
    },

    afterRender: function(){
        this.domEvents();
    },


    domEvents: function(){
        //this.dogHead();
    },


    dogHead: function(){
        $("#container").scroll(function(){
            var currentScroll = $(this).scrollTop() + $(this).innerHeight();
            var scrollHeight = this.scrollHeight - 2;
            if(currentScroll >= scrollHeight ){
                $("#dogHead").animate({
                    "top" : "0px"
                },
                    300
                );
            }
        });
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

    pubSub: function(){
        var self = this;
        this.listenTo(Backbone, "Unauthorized", self.unauthorizedHandler);
    },

    unauthorizedHandler: function(){
        App.error("You are not authorized to edit documents.");
        App.router.navigate("/", { trigger: true });
    },


    mobileLogoHandler: function(e){
        e.preventDefault();
        App.router.navigate("/", { trigger: true });
    },

    mobileMenuBtnHandler: function(e){
        e.preventDefault();
        this.mobileMenu = !this.mobileMenu;
        if(this.mobileMenu){
            $("#menu").slideDown();
        } else {
            $("#menu").slideUp();
        }
    },

    removeIndexClass: function(){
        $(this.containerEl).removeClass("index");
    },

    addIndexClass: function(){
        console.log("adding index class");
        $(this.containerEl).addClass("index");
    },




})
