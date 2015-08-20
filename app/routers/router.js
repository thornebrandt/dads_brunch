var App = require('application');

module.exports = Backbone.Router.extend({
    initialize: function(){
        App.Views.AppView = require('../views/app-view');
        App.Views.AdminView = require('../views/admin-view');
        App.Views.IndexView = require('../views/index-view');
        App.Views.AdminShowsView = require('../views/admin-shows-view');
        App.Views.ShowView = require('../views/show-view');
        App.Views.NewShowView = require('../views/new-show-view');
        App.Views.EditShowView = require('../views/edit-show-view');
        this.setupAjax();

    },

    routes: {
        '': 'index',
        'admin(/)' : 'adminShows',
        'admin/shows(/)': 'adminShows',
        'admin/shows/new(/)': 'newShow',
        'shows/:urlTitle(/)' : 'specificShow',
        'admin/shows/:urlTitle/edit(/)' : 'editShow',
        'login/:password': 'loginRoute',
        'logout' : 'logoutRoute',
        '*path' : 'defaultRoute',
    },

    defaultRoute: function(){
        this.index();
    },

    loginRoute: function(_password){
        //$.cookie('password', md5(_password), { expires: 7, path: '/' });
        window.localStorage.setItem('password', md5(_password));
        App.authorized = true;
        console.log("setting app authorized");
        console.log(App.authorized);
        this.setupAjax();
        this.navigate("shows", {trigger: true, replace: true })
    },

    logoutRoute: function(){
        console.log("removing password");
        //$.removeCookie('password');
        window.localStorage.removeItem('password');
        App.authorized = false;
        this.setupAjax();
        this.navigate("/", { trigger: true, replace: true });
    },

    loadApp: function(){
        App.adminView = false;
        if(!App.appView) {
            App.appView = new App.Views.AppView();
            App.appView.render();
        }
        App.appView.removeIndexClass();
        this.garbageCollection();
    },

    loadAdmin: function(){
        App.appView = false;
        if(!App.adminView){
            App.adminView = new App.Views.AdminView();
            App.adminView.render();
        }
    },

    index: function() {
        this.loadApp();
        App.appView.addIndexClass();
        console.log("loadin gindex");
        App.views.indexView = new App.Views.IndexView();
        //App.views.indexView.render();
        App.views.indexView.fetchCurrentShow();
    },

    specificShow: function(_urlTitle){
        this.loadApp();
        App.views.showView = new App.Views.ShowView();
        App.views.showView.fetchShow(_urlTitle);
    },

    editShow: function(_urlTitle){
        if(App.authorized){
            this.loadAdmin();
            App.views.editShowView = new App.Views.EditShowView();
            App.views.editShowView.fetchShow(_urlTitle);
        } else {
            App.error("Not authorized to edit");
            this.navigate("/", { trigger: true, replace: true });
        }
    },

    admin: function(){
        console.log("admin route");
        if(App.authorized){
            this.loadAdmin();
        }
    },


    adminShows: function(){
        if(App.authorized){
            this.loadAdmin();
            App.views.adminShowsView = new App.Views.AdminShowsView();
            App.views.adminShowsView.render();
        }
    },

    newShow: function(){
        if(App.authorized){
            this.loadAdmin();
            App.views.newShowView = new App.Views.NewShowView();
            App.views.newShowView.render();
        } else {
            App.error("Not authorized to create new dudes");
            this.navigate("/", { trigger: true, replace: true });
        }
    },


    setupAjax: function(){
        var password = window.localStorage.getItem('password');
        $.ajaxSetup({
            headers: { 'password' : password },
            crossDomain: true,
            statusCode: {
                401: function(e){
                    Backbone.trigger("Unauthorized");
                }
            }
        });
    },

    garbageCollection: function(){
        for(v in App.views){
            var view = App.views[v];
            view.undelegateEvents();
            view.stopListening(Backbone);
            view.stopListening();
        }
    }


})
