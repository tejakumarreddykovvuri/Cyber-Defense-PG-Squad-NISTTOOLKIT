//Requiring Mongoose
var mongoose = require('mongoose');

//Defining Schema for RESPOND PHASE
var respondscoreSchema = mongoose.Schema({

    _id: {
      type: String,
      required: true
    },
    RSRP1: {
        type: String,
        required: true
    },
    RSRP1D: {
        type: String,
        required: true
    },
    RSCO1: {
        type: String,
        required: true
    },
    RSCO1D: {
        type: String,
        required: true
    },
    RSCO2: {
        type: String,
        required: true
    },
    RSCO2D: {
        type: String,
        required: true
    },
    RSCO3: {
        type: String,
        required: true
    },
    RSCO3D: {
        type: String,
        required: true
    },
    RSCO4: {
        type: String,
        required: true
    },
    RSCO4D: {
        type: String,
        required: true
    },
    RSAN1: {
        type: String,
        required: true
    },
    RSAN1D: {
        type: String,
        required: true
    },
    RSAN2: {
        type: String,
        required: true
    },
    RSAN2D: {
        type: String,
        required: true
    },
    RSAN3: {
        type :String,
        required: true
    },
    RSAN3D: {
        type :String,
        required: true
    },
    RSMI1: {
        type: String,
        required: true
    },
    RSMI1D: {
        type: String,
        required: true
    },
    RSMI2: {
        type: String,
        required: true
    },
    RSMI2D: {
        type: String,
        required: true
    },
    RSIM1: {
        type: String,
        required: true
    },
    RSIM1D: {
        type: String,
        required: true
    },
    RSIM2: {
        type: String,
        required: true
    },
    RSIM2D: {
        type: String,
        required: true
    },
    rsc1sr: {
        type: String,
        required: true
    },
    rsc1risk: {
        type: String,
        required: true
    },
    rsc2sr: {
        type: String,
        required: true
    },
    rsc2risk: {
        type: String,
        required: true
    },
    rsc3sr: {
        type: String,
        required: true
    },
    rsc3risk: {
        type: String,
        required: true
    },
    rsc4sr: {
        type: String,
        required: true
    },
    rsc4risk: {
        type: String,
        required: true
    },
    rsc5sr: {
        type: String,
        required: true
    },
    rsc5risk: {
        type: String,
        required: true
    },
    ror:{
        type: String,
        required: true
    },
    roml:{
        type: String,
        required: true
    },
    rorm:{
        type: String,
        required: true
    },
    create_date: {
        type: Date,
        default: Date.now
    }
});

var RespondScore = module.exports = mongoose.model('RespondScoreCollection', respondscoreSchema); //Binding schema to StudentCollection

//Inserting student Details
module.exports.addRespondScore = function(respondscore, callback) {
  console.log("RESPOND PHASE data saving");
    RespondScore.create(respondscore, callback);
}
module.exports.getUserById = function(_id, callback) {
    RespondScore.findById(_id, callback);
}
