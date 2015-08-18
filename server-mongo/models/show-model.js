var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var currentDate = new Date();

var showSchema = new mongoose.Schema({
    title: String,
    urlTitle: String,
    date: Date,
    summary: String,
    description: String,
    time_info: String,
    photo: String,
    thumb: String,
    created_at: Date,
    updated_at: Date,
    active: Boolean
},
{
    collection: 'showCollection'
});

showSchema.pre('save', function(next){
  now = new Date();
  this.updated_at = now;
  if ( !this.created_at ) {
    this.created_at = now;
  }
  next();
});


showSchema.index({ urlTitle: 1}, { unique: true })

module.exports = mongoose.model('ShowModel', showSchema);
