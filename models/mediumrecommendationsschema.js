//Requiring Mongoose
var mongoose = require('mongoose');

//Defining Schema for IDENTIFY PHASE
var recSchema = mongoose.Schema({

    _id: {
      type: String,
      required: true
    },
    rec: {
        type: String,
        required: true
    },

    create_date: {
        type: Date,
        default: Date.now
    }
});

//Exporting the file
var Rec2 = module.exports = mongoose.model('mediumrecommendations', recSchema); //Binding schema to StudentCollection
//Inserting student Details
module.exports.addRec = function(recs, callback) {
  Rec2.create(recs, callback);
}

module.exports.getRec = function(_id, callback) {
      Rec2.findById(_id, callback);
}
