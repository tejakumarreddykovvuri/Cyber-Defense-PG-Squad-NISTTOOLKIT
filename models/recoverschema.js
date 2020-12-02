//Requiring Mongoose
var mongoose = require('mongoose');

//Defining Schema for RECOVER PHASE
var recoverscoreSchema = mongoose.Schema({

    _id: {
      type: String,
      required: true
    },
    RCRP1: {
        type: String,
        required: true
    },
    RCRP1D: {
        type: String,
        required: true
    },
    RCRP2: {
        type: String,
        required: true
    },
    RCRP2D: {
        type: String,
        required: true
    },
    RCRP3: {
        type: String,
        required: true
    },
    RCRP3D: {
        type: String,
        required: true
    },
    RCIM1: {
        type: String,
        required: true
    },
    RCIM1D: {
        type: String,
        required: true
    },
    RCIM2: {
        type: String,
        required: true
    },
    RCIM2D: {
        type: String,
        required: true
    },
    RCCO1: {
        type: String,
        required: true
    },
    RCCO1D: {
        type: String,
        required: true
    },
    RCCO2: {
        type: String,
        required: true
    },
    RCCO2D: {
        type: String,
        required: true
    },
    resc1sr: {
        type: String,
        required: true
    },
    resc1risk: {
        type: String,
        required: true
    },
    resc2sr: {
        type: String,
        required: true
    },
    resc2risk: {
        type: String,
        required: true
    },
    resc3sr: {
        type: String,
        required: true
    },
    resc3risk: {
        type: String,
        required: true
    },
    reor:{
        type: String,
        required: true
    },
    reoml:{
        type: String,
        required: true
    },
    reorm:{
        type: String,
        required: true
    },
    create_date: {
        type: Date,
        default: Date.now
    }
});

var RecoverScore = module.exports = mongoose.model('RecoverScoreCollection', recoverscoreSchema); //Binding schema to StudentCollection

//Inserting student Details
module.exports.addRecoverScore = function(recoverscore, callback) {
  console.log("RECOVER PHASE data saving");
    RecoverScore.create(recoverscore, callback);
}

module.exports.getUserById = function(_id, callback) {
    RecoverScore.findById(_id, callback);
}
