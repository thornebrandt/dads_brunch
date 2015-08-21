var ShowModel = require("../models/show-model");
module.exports = Backbone.Collection.extend({
    url: BASE_URL + "/shows",
    model: ShowModel,
});