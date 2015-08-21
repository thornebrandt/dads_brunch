module.exports = function(){
    Modernizr.addTest('firefox', function () {
     return !!navigator.userAgent.match(/firefox/i);
    });
    Modernizr.addTest('safari', function(){
        return !!( navigator.userAgent.indexOf("Safari") > -1 &&
                    navigator.userAgent.indexOf("Chrome") === -1 )
    });
    Modernizr.addTest('ie', function(){
        return !!( navigator.userAgent.indexOf("MSIE") > -1 ||
                    navigator.appName.indexOf("trident") > -1  ||
                    navigator.appName.indexOf("Trident") > -1 ||
                    navigator.userAgent.match(/Trident.*rv\:11\./)
                     )
    });
}