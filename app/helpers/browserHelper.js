module.exports = function(){
    Modernizr.addTest('firefox', function () {
     return !!navigator.userAgent.match(/firefox/i);
    });
}