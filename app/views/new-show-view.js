var View     = require('./view');
var ShowPreviewView = require('../views/show-preview-view');
var template = require('../templates/new-show-template');
var ShowModel = require('../models/show-model');
var time = require('../helpers/dateHelper');
var FileHelper = require('../helpers/fileHelper');

module.exports = View.extend({
    el: "#admin_content",
    id: 'index-view',
    template: template,
    events: {
        'submit #showForm' : 'submitShowFormHandler',
    },
    afterRender: function(){
        this.setupDatePick();
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
        var url = BASE_URL + "/shows/new"

        $('#fileupload').fileupload({
            url: url,
            dataType: 'json',
            add: function(e, data){
                $("#upload_btn").off('click').on('click', function(e){
                    e.preventDefault();
                    data.submit();
                });
            },
            done: function(e, data){
                console.log(data.result);
                var image_path = data.result.photo;
                var urlTitle = data.result.urlTitle;
                var date = new moment(data.result.date, time.UTC_format).format(time.url_format);
                var url = "/shows/" +  urlTitle;
                App.router.navigate(url, { trigger: true });
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
    },

    setupDatePick: function(){
        var $dateInput = $("#dateInput");
        var today = new moment().format(time.datepicker_format);
        $dateInput.val(today);

        $("#inlineDatePicker").datepicker({
            onSelect: function(date){
                $dateInput.val(date);
            },
        });
    }
})
