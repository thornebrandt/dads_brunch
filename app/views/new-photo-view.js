var View     = require('./view');
var template = require('../templates/new-photo-template');
var PhotoModel = require('../models/photo-model');
var FileHelper = require('../helpers/fileHelper');

module.exports = View.extend({
    el: "#admin_content",
    id: 'index-view',
    template: template,
    events: {
        'submit #showForm' : 'submitShowFormHandler',
    },
    afterRender: function(){
        this.setupUploader();
        this.setupImagePreview();
    },

    showPreviewImage: function(source) {
        $("#imagePreview").attr("src", source);
    },

    setupImagePreview: function(){
        var fileHelper = new FileHelper();
        fileHelper.uploadImagePreview( $("#fileupload"), this.showPreviewImage);
    },

    setupUploader: function(){
        var url = BASE_URL + "/photos"
        var self = this;
        $('#fileupload').fileupload({
            url: url,
            dataType: 'json',
            add: function(e, data){
                $("#upload_btn").off('click').on('click', function(e){
                    e.preventDefault();
                    var formObj = $("#photoForm").serializeObject();
                    data.formData = formObj;
                    data.submit();
                });
            },
            done: function(e, data){
                App.router.navigate("media", { trigger: true });
            },
            progressall: function(e, data){
                var progress = parseInt(data.loaded / data.total * 100, 10);
                console.log("progress: " + progress);
            },
            fail: function(e, data){
                console.log("fail");
                console.log(e);
                console.log(data);
            }
        });
    }

})
