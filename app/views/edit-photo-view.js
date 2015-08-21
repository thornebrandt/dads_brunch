var View     = require('./view');
var template = require('../templates/edit-photo-template');
var PhotoModel = require('../models/photo-model');
var ShowsCollection = require('../collections/show-collection');
var FileHelper = require('../helpers/fileHelper');

module.exports = View.extend({
    el: "#admin_content",
    template: template,
    events: {
        'submit #photoForm' : 'submitFormHandler',
        'submit #showForm' : 'submitFormHandler',
        'click #deletePhotoBtn' : 'deleteHandler',
        'change #showSelect' : 'populateShowID',
    },

    afterRender: function(){
        this.setupThumbUploader();
        this.setupThumbPreview();
        this.setupShowSelect();
    },

    populateShowID: function(e){
        console.log("selected");
        $("#show_idInput").val(  $(e.target).val() );
    },

    setupShowSelect: function(){
        this.showsCollection = new ShowsCollection();
        var self = this;
        this.showsCollection.fetch({
            success: function(data){
                self.populateShowSelect();
            },
            error: function(e){
                console.log("something went wrong fetching shows for dropdown");
                console.log(e.responseText);
            }
        });
    },

    populateShowSelect: function(){
        this.showsCollection.each(function(model){
            var _id = model.get("_id");
            var title = model.get("title");
            var selected = "";
            if(_id === $("#show_idInput").val() ){
                selected = "selected"
            }
            var optionString = "<option "+selected+" value ='"+_id+"'>"+title+"</option>";

            $("#showSelect").append(
                optionString
            );
        });
    },

    getRenderData: function(){
        return this.model.toJSON();
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
        var url = BASE_URL + "/photos/edit/";
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
                App.router.navigate("media", {trigger: true});
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

    deleteHandler: function(e){
        e.preventDefault();
        var self = this;
        App.prompt("Are you sure you want to do this?", function(){
            App.closeDialog();
            self.delete();
        });
    },

    delete: function(){
        var url = BASE_URL + "/photos/" + this.model.get("_id");
        this.model.save(
            this.model.toJSON(),
            {
                url: url,
                type: 'DELETE'
            }
        ).then(
            function success(data){
                App.router.navigate("media", { trigger: true });
            },
            function error(e){
                console.log("error deleting");
                console.log(e.responseText);
            }
        );
    },


    submitFormHandler: function(e){
        e.preventDefault();
        var self = this;
        var _id = this.model.get("_id");
        this.model = new PhotoModel( $(e.target).serializeObject() );
        this.model.set("_id", _id);
        var url = BASE_URL + "/photos/edit";
        this.model.save(
            this.model.toJSON(),
            {
                patch: true,
                url: url,
                type: 'PATCH',
                success: function(data){
                    App.router.navigate("media", {trigger: true});
                },
                error: function(e){
                    console.log("error patching");
                    console.log(e.responseText);
                }
            }
        );
    },

    fetchPhoto: function(_id){
        var self = this;
        this._id = _id;
        var url = BASE_URL + "/photos/" + this._id;
        this.model = new PhotoModel();
        this.model.fetch({
            url: url,
            success: function(data){
                self.render();
            },
            error: function(model, response){
                console.log("something went wrong getting a specific photo");
                console.log(response);
            }
        });
    }


})
