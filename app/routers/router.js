var App = require('application');

module.exports = Backbone.Router.extend({

    initialize: function(){
        App.Views.IndexView = require('../views/index-view');
        App.Views.ShowView = require('../views/show-view');
        App.Views.CalendarView = require('../views/calendar-view');
        App.Views.MediaView = require('../views/media-view');
        App.Views.AboutView = require('../views/about-view');
        App.Views.AppView = require('../views/app-view');
        App.Views.AdminView = require('../views/admin-view');
        App.Views.AdminShowsView = require('../views/admin-shows-view');
        App.Views.NewShowView = require('../views/new-show-view');
        App.Views.NewPhotoView = require('../views/new-photo-view');
        App.Views.EditShowView = require('../views/edit-show-view');
        App.Views.EditPhotoView = require('../views/edit-photo-view');
        this.setupAjax();

    },


    routes: {
        '': 'index',
        'shows/:urlTitle(/)' : 'specificShow',
        'calendar(/)' : 'calendar',
        'shows(/)' : 'calendar',
        'media(/)' : 'media',
        'about(/)' : 'about',
        'admin(/)' : 'adminShows',
        'admin/shows(/)': 'adminShows',
        'admin/shows/new(/)': 'newShow',
        'admin/photos/new(/)': 'newPhoto',
        'admin/photos/:id(/)' : 'editPhoto',
        'admin/shows/:urlTitle/edit(/)' : 'editShow',
        'admin/shows/:urlTitle(/)' : 'editShow',
        'login/:password(/)': 'loginRoute',
        'logout(/)' : 'logoutRoute',
        '*path(/)' : 'defaultRoute',
    },

    defaultRoute: function(){
        this.index();
    },

    _routeToRegExp: function (route) {
          var optionalParam = /\((.*?)\)/g;
          var namedParam    = /(\(\?)?:\w+/g;
          var splatParam    = /\*\w+/g;
          var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;

          route = route.replace(escapeRegExp, '\\$&')
                       .replace(optionalParam, '(?:$1)?')
                       .replace(namedParam, function(match, optional) {
                         return optional ? match : '([^/?]+)';
                       })
                       .replace(splatParam, '([^?]*?)');
          return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$', 'i');
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

    calendar: function(){
        this.loadApp();
        console.log("calendar route back btns?");
        App.views.calendarView = new App.Views.CalendarView();
        App.views.calendarView.render();
        App.views.calendarView.fetchShows();
    },

    media: function(){
        this.loadApp();
        App.views.mediaView = new App.Views.MediaView();
        App.views.mediaView.render();
        App.views.mediaView.fetchPhotos();
    },

    about: function(){
        this.loadApp();
        App.views.aboutView = new App.Views.AboutView();
        App.views.aboutView.render();
    },

    index: function() {
        this.loadApp();
        App.appView.addIndexClass();
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

    editPhoto: function(_id){
        if(App.authorized){
            this.loadAdmin();
            App.views.editPhotoView = new App.Views.EditPhotoView();
            App.views.editPhotoView.fetchPhoto(_id);
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
            App.error("Not authorized to create new shows");
            this.navigate("/", { trigger: true, replace: true });
        }
    },

    newPhoto: function(){
        if(App.authorized){
            this.loadAdmin();
            App.views.newPhotoView = new App.Views.NewPhotoView();
            App.views.newPhotoView.render();
        } else {
            App.error("Not authorized to upload new photos");
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
