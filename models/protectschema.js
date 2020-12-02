//Requiring Mongoose
var mongoose = require('mongoose');

//Defining Schema for PROTECT PHASE
var protectscoreSchema = mongoose.Schema({

    _id: {
      type: String,
      required: true
    },
    PRAC1: {
        type: String,
        required: true
    },
    PRAC1D: {
        type: String,
        required: true
    },
    PRAC2: {
        type: String,
        required: true
    },
    PRAC2D: {
        type: String,
        required: true
    },
    PRAC3: {
        type: String,
        required: true
    },
    PRAC3D: {
        type: String,
        required: true
    },
    PRAC4: {
        type: String,
        required: true
    },
    PRAC4D: {
        type: String,
        required: true
    },
    PRAT1: {
        type: String,
        required: true
    },
    PRAT1D: {
        type: String,
        required: true
    },
    PRAT2: {
        type: String,
        required: true
    },
    PRAT2D: {
        type: String,
        required: true
    },
    PRAT3: {
        type: String,
        required: true
    },
    PRAT3D: {
        type: String,
        required: true
    },
    PRDS1: {
        type: String,
        required: true
    },
    PRDS1D: {
        type: String,
        required: true
    },
    PRDS2: {
        type: String,
        required: true
    },
    PRDS2D: {
        type: String,
        required: true
    },
    PRDS3: {
        type: String,
        required: true
    },
    PRDS3D: {
        type: String,
        required: true
    },
    PRDS4: {
        type: String,
        required: true
    },
    PRDS4D: {
        type: String,
        required: true
    },
    PRDS5: {
        type: String,
        required: true
    },
    PRDS5D: {
        type: String,
        required: true
    },
    PRDS6: {
        type: String,
        required: true
    },
    PRDS6D: {
        type: String,
        required: true
    },
    PRDS7: {
        type: String,
        required: true
    },
    PRDS7D: {
        type: String,
        required: true
    },
    PRIP1: {
        type: String,
        required: true
    },
    PRIP1D: {
        type: String,
        required: true
    },
    PRIP2: {
        type: String,
        required: true
    },
    PRIP2D: {
        type: String,
        required: true
    },
    PRIP3: {
        type: String,
        required: true
    },
    PRIP3D: {
        type: String,
        required: true
    },
    PRIP4: {
        type: String,
        required: true
    },
    PRIP4D: {
        type: String,
        required: true
    },
    PRIP5: {
        type: String,
        required: true
    },
    PRIP5D: {
        type: String,
        required: true
    },
    PRIP6: {
        type: String,
        required: true
    },
    PRIP6D: {
        type: String,
        required: true
    },
    PRMA1: {
        type: String,
        required: true
    },
    PRMA1D: {
        type: String,
        required: true
    },
    PRMA2: {
        type: String,
        required: true
    },
    PRMA2D: {
        type: String,
        required: true
    },
    PRPT1: {
        type: String,
        required: true
    },
    PRPT1D: {
        type: String,
        required: true
    },
    PRPT2: {
        type: String,
        required: true
    },
    PRPT2D: {
        type: String,
        required: true
    },
    PRPT3: {
        type: String,
        required: true
    },
    PRPT3D: {
        type: String,
        required: true
    },
    PRPT4: {
        type: String,
        required: true
    },
    PRPT4D: {
        type: String,
        required: true
    },
    PRPT5: {
        type: String,
        required: true
    },
    PRPT5D: {
        type: String,
        required: true
    },
    psc1sr: {
        type: String,
        required: true
    },
    psc1risk: {
        type: String,
        required: true
    },
    psc2sr: {
        type: String,
        required: true
    },
    psc2risk: {
        type: String,
        required: true
    },
    psc3sr: {
        type: String,
        required: true
    },
    psc3risk: {
        type: String,
        required: true
    },
    psc4sr: {
        type: String,
        required: true
    },
    psc4risk: {
        type: String,
        required: true
    },
    psc5sr: {
        type: String,
        required: true
    },
    psc5risk: {
        type: String,
        required: true
    },
    psc6sr: {
        type: String,
        required: true
    },
    psc6risk: {
        type: String,
        required: true
    },
    por: {
        type: String,
        required: true
    },
    poml:{
        type: String,
        required: true
    },
    porm:{
        type: String,
        required: true
    },
    create_date: {
        type: Date,
        default: Date.now
    }
});

var ProtectScore = module.exports = mongoose.model('ProtectScoreCollection', protectscoreSchema); //Binding schema to StudentCollection

//Inserting student Details
module.exports.addProtectScore = function(protectscore, callback) {
  console.log("PROTECT PHASE data saving");
    ProtectScore.create(protectscore, callback);
}
module.exports.getUserById = function(_id, callback) {
    ProtectScore.findById(_id, callback);
}
