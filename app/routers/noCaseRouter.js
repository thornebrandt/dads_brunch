var App = require('application');

module.exports = Backbone.Router.extend({
    _routeToRegExp: function (route) {
            console.log("route");
          var namedParam    = /:\w+/g;
          var splatParam    = /\*\w+/g;
          var escapeRegExp  = /[-[\]{}()+?.,\\^$|#\s]/g;

          route = route.replace(escapeRegExp, '\\$&')
                       .replace(namedParam, '([^\/]+\/?)')
                       .replace(splatParam, '(.*?)');

          return new RegExp('^' + route + '$', 'i');
          /*
           * Note: If you would like case insensitivity,
           *       add the "i" attribute to the return
           * return new RegExp('^' + route + '$', 'i');
           */
    },

});