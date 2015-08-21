module.exports = function(){
    Modernizr.addTest('firefox', function () {
     return !!navigator.userAgent.match(/firefox/i);
    });
    Modernizr.addTest('safari', function(){
        return !!( navigator.userAgent.indexOf("Safari") > -1 &&
                    navigator.userAgent.indexOf("Chrome") === -1 )
    });
}