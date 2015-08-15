// Application bootstrapper.
App = {
    initialize: function() {
        var Router   = require('routers/router');
        this.Views = {};
        this.views = {}; //instances
        this.Models = {};
        this.models = {}; //instances
        this.router   = new Router();

        if( window.localStorage.getItem("password") ){
            App.authorized = true;
        }
    },
    error: function(_string){
        $("#dialogErrorContent").html(_string);
        $("#dialogError").dialog();
    }
}

module.exports = App
