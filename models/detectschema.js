//Requiring Mongoose
var mongoose = require('mongoose');

//Defining Schema for DETECT PHASE
var detectscoreSchema = mongoose.Schema({

    _id: {
      type: String,
      required: true
    },
    DEAE1: {
        type: String,
        required: true
    },
    DEAE1D: {
        type: String,
        required: true
    },
    DEAE2: {
        type: String,
        required: true
    },
    DEAE2D: {
        type: String,
        required: true
    },
    DEAE3: {
        type: String,
        required: true
    },
    DEAE3D: {
        type: String,
        required: true
    },
    DECM1: {
        type: String,
        required: true
    },
    DECM1D: {
        type: String,
        required: true
    },
    DECM2: {
        type: String,
        required: true
    },
    DECM2D: {
        type: String,
        required: true
    },
    DECM3: {
        type: String,
        required: true
    },
    DECM3D: {
        type: String,
        required: true
    },
    DECM4: {
        type: String,
        required: true
    },
    DECM4D: {
        type: String,
        required: true
    },
    DECM5: {
        type: String,
        required: true
    },
    DECM5D: {
        type: String,
        required: true
    },
    DECM6: {
        type: String,
        required: true
    },
    DECM6D: {
        type: String,
        required: true
    },
    DECM7: {
        type: String,
        required: true
    },
    DECM7D: {
        type: String,
        required: true
    },
    DECM8: {
        type: String,
        required: true
    },
    DECM8D: {
        type: String,
        required: true
    },
    DEDP1: {
        type: String,
        required: true
    },
    DEDP1D: {
        type: String,
        required: true
    },
    DEDP2: {
        type: String,
        required: true
    },
    DEDP2D: {
        type: String,
        required: true
    },
    DEDP3: {
        type: String,
        required: true
    },
    DEDP3D: {
        type: String,
        required: true
    },
    DEDP4: {
        type: String,
        required: true
    },
    DEDP4D: {
        type: String,
        required: true
    },
    DEDP5: {
        type: String,
        required: true
    },
    DEDP5D: {
        type: String,
        required: true
    },
    DEDP6: {
        type: String,
        required: true
    },
    DEDP6D: {
        type: String,
        required: true
    },
    dsc1sr: {
        type: String,
        required: true
    },
    dsc1risk: {
        type: String,
        required: true
    },
    dsc2sr: {
        type: String,
        required: true
    },
    dsc2risk: {
        type: String,
        required: true
    },
    dsc3sr: {
        type: String,
        required: true
    },
    dsc3risk: {
        type: String,
        required: true
    },
    dor:{
        type: String,
        required: true
    },
    doml:{
        type: String,
        required: true
    },
    dorm:{
        type: String,
        required: true
    },
    create_date: {
        type: Date,
        default: Date.now
    }
});

var DetectScore = module.exports = mongoose.model('DetectScoreCollection', detectscoreSchema); //Binding schema to StudentCollection

//Inserting student Details
module.exports.addDetectScore = function(detectDetectscore, callback) {
  console.log("DETECT PHASE data saving");
    DetectScore.create(detectscore, callback);
}
module.exports.getUserById = function(_id, callback) {
    DetectScore.findById(_id, callback);
}
