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
        var $dialog = $("#dialogError");
        $("#dialogErrorContent").html(_string);
        $dialog.attr("title", "Error, Yo.");
        $dialog.dialog();
    },

    prompt: function(_string, _callback){
        var $dialog = $("#dialogError");
        $("#dialogErrorContent").html(_string);
        var buttons = {
            "No" : function(){
                    $(this).dialog("close");
            },
            "Yes" : _callback
        }
        $dialog.dialog({
            buttons: buttons
        });
    },

    closeDialog: function(){
        var $dialog = $("#dialogError");
        $dialog.dialog("close");
    }
}

module.exports = App
