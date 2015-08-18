var Model = require('./model');
var time = require('../helpers/dateHelper');

module.exports = Model.extend({
    //url: BASE_URL + "/dudes/new",
    url: BASE_URL + "/show",
    formatDate: function(){
        var modelDate = new moment(this.get("date"));
        this.set("formattedDate", modelDate.format(time.upcoming_format));
        this.set("URLdate", modelDate.format(time.url_format));
        this.set("showDate", modelDate.format(time.readable_format));
    }
});
