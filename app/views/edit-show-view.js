var View     = require('./view');
var template = require('../templates/edit-show-template');
var ShowModel = require('../models/show-model');
var time = require('../helpers/dateHelper');
var FileHelper = require('../helpers/fileHelper');

module.exports = View.extend({
    el: "#admin_content",
    template: template,
    events: {
        'submit #showForm' : 'submitShowFormHandler',
        'submit #newShowPhotoForm' : 'submitShowPhotoFormHandler',
        'click #showBtn' : 'clickShowHandler',
        'click #showsBtn' : 'clickShowsHandler',
        'click #deleteShowBtn' : 'deleteShowHandler'
    },

    afterRender: function(){
        this.setupDatePick();
        this.setupPhotoUploader();
        this.setupThumbUploader();
        this.setupShowPhotoUploader();
        this.setupPhotoPreview();
        this.setupShowPhotoPreview();
        this.setupThumbPreview();
    },


    getRenderData: function(){
        this.model.formatDate();
        return this.model.toJSON();
    },

    showPreviewPhoto: function(source){
        $("#photoPreview").attr("src", source);
    },

    setupPhotoPreview: function(){
        var fileHelper = new FileHelper();
        var self = this;
        this.originalPhoto = $("#photoPreview").attr("src");
        fileHelper.uploadImagePreview( $("#photoInput"), this.showPreviewPhoto, {
            onError: function(errorMessage){
                App.error(errorMessage);
                self.revertPreviewPhoto();
            }
        });
    },

    setupShowPhotoPreview: function(){
        var fileHelper = new FileHelper();
        var self = this;
        this.originalShowPhoto = $("#showPhotoPreview").attr("src");
        fileHelper.uploadImagePreview( $("#showPhotoInput"), this.showPreviewShowPhoto, {
            onError: function(errorMessage){
                App.error(errorMessage);
                self.revertPreviewShowPhoto();
            }
        });
    },

    showPreviewShowPhoto: function(source){
        $("#showPhotoPreview").attr("src", source);
    },

    revertPreviewShowPhoto: function(){
        $("#showPhotoPreview").attr("src", this.originalShowPhoto);
    },

    revertPreviewImage: function(){
        $("#photoPreview").attr("src", this.originalPhoto);
    },


    showPreviewThumb: function(source){
        $("#thumbPreview").attr("src", source);
        $("#photoInputContainer").html("Only editing thumb");
    },

    setupThumbPreview: function(){
        var fileHelper = new FileHelper();
        var self = this;
        this.originalThumb = $("#thumbPreview").attr("src");
        fileHelper.uploadImagePreview( $("#thumbInput"), this.showPreviewThumb, {
            onError: function(errorMessage){
                App.error(errorMessage);
                self.revertPreviewThumb();
            }
        });
    },

    revertPreviewThumb: function(){
        $("#thumbPreview").attr("src", this.originalThumb);
    },

    setupUploader: function($el){
        var _id = this.model.get("_id");
        var url = BASE_URL + "/shows/edit/";
        var self = this;

        $el.fileupload({
            url: url,
            type: "PATCH",
            dataType: 'json',
            add: function(e, data){
                $("#upload_btn").off('click').on('click', function(e){
                    e.preventDefault();
                    var formObj = $("#showForm").serializeObject();
                    formObj._id = _id;
                    data.formData = formObj;
                    data.submit();
                });

            },
            done: function(e, data){
                self.navigateToShow(data.result);
            },
            progressall: function(e, data){
                var progress = parseInt(data.loaded / data.total * 100, 10);
                console.log("progress: " + progress);
            },
            error: function(e, textStatus, errorThrown){
                App.error("Something went wrong with uploading </br>" + e.responseText);
            }
        });
    },


    setupThumbUploader: function(){
        this.setupUploader($("#thumbInput"));
    },

    setupShowPhotoUploader: function(){
        var show_id = this.model.get("_id");
        var url = BASE_URL + "/photos"
        var self = this;
        $("#showPhotoInput").fileupload({
            url: url,
            type: "POST",
            dataType: 'json',
            add: function(e, data){
                $("#upload_sub_photo").off('click').on('click', function(e){
                    e.preventDefault();
                    var formObj = $("#newShowPhotoForm").serializeObject();
                    formObj.show_id = show_id;
                    data.formData = formObj;
                    data.submit();
                });
            },
            done: function(e, data){
                self.navigateToShow(self.model.toJSON());
            },
            progressall: function(e, data){
            },
            error: function(e, textStatus, errorThrown){
                App.error("something went wrong with uploading </b>" + e.responseText);
            }
        });
    },

    setupPhotoUploader: function(){
        //mainphoto
        this.setupUploader($("#photoInput"));
    },

    deleteShowHandler: function(e){
        e.preventDefault();
        var self = this;
        App.prompt("Are you sure you want to do this?", function(){
            App.closeDialog();
            self.deleteShow();
            //App.closeDialog();
        });
    },

    deleteShow: function(){
        var url = BASE_URL + "/show";
        this.model.save(
            this.model.toJSON(),
            {
                url: url,
                type: 'DELETE'
            }
        ).then(
            function success(data){
                App.router.navigate("admin/shows", { trigger: true });
            },
            function error(e){
                console.log("error deleting");
                console.log(e.responseText);
            }
        );
    },


    submitShowFormHandler: function(e){
        e.preventDefault();
        var self = this;
        var _id = this.model.get("_id");
        this.model = new ShowModel( $(e.target).serializeObject() );
        this.model.set("_id", _id);

        var url = BASE_URL + "/shows/edit";
        this.model.save(
            this.model.toJSON(),
            {
                patch: true,
                url: url,
                type: 'PATCH'
            }
        ).then(
            function success(data){
                self.navigateToShow(data);
            },
            function error(e){
                console.log("error patching");
                console.log(e.responseText);
            }
        );

        var $form = $(e.target);
        var $fileInput = $("#fileupload");
    },

    submitShowPhotoFormHandler: function(e){
        e.preventDefault();
        App.error("Must include a photo");
    },

    setupDatePick: function(){
        var $dateInput = $("#dateInput");
        var $datePicker = $("#inlineDatePicker");
        var savedDate = new moment($dateInput.val()).toDate();
        $datePicker.datepicker({
            onSelect: function(date){
                var ISO_date = new moment(date, time.datepicker_format).zone("-05:00").format();
                $dateInput.val(ISO_date);
            },
        });
        $datePicker.datepicker('setDate', savedDate);
    },

    fetchShow: function(_urlTitle){
        var self = this;
        this.urlTitle = _urlTitle;
        var url = BASE_URL + "/show/" + this.urlTitle;
        this.model = new ShowModel();
        this.model.fetch({
            url: url,
            success: function(data){
                self.render();
            },
            error: function(model, response){
                console.log("something went wrong getting a specific show");
                console.log(response);
            }
        });
    },

    clickShowHandler: function(e){
        e.preventDefault();
        var url = "/shows/" + this.URLdate + "/" + this.show;
        App.router.navigate(url, { trigger: true });
    },

    navigateToShow: function(_model){
        var showModel = new ShowModel(_model);
        var url = "/shows/" + showModel.get("urlTitle");
        App.router.navigate(url, { trigger: true });
    },

    clickShowsHandler: function(e){
        e.preventDefault();
        App.router.navigate("/shows/", { trigger: true });
    }



})
