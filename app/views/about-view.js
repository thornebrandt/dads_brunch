var View     = require('./view');
var template = require('../templates/about-template');

module.exports = View.extend({
    el: "#main",
    template: template,
    afterRender: function(){
        setTimeout(  App.appView.checkHeight,  300 );
    }
})
