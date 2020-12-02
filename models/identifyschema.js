//Requiring Mongoose
var mongoose = require('mongoose');

//Defining Schema for IDENTIFY PHASE
var identifyscoreSchema = mongoose.Schema({
	
    _id: {
      type: String,
      required: true
    },
    IDAM1: {
        type: String,
        required: true
    },
    IDAM1D: {
        type: String,
        required: true
    },
    IDAM2: {
        type: String,
        required: true
    },
    IDAM2D: {
        type: String,
        required: true
    },
    IDAM3: {
        type: String,
        required: true
    },
    IDAM3D: {
        type: String,
        required: true
    },
    IDAM4: {
        type: String,
        required: true
    },
    IDAM4D: {
        type: String,
        required: true
    },
    IDBE1: {
        type: String,
        required: true
    },
    IDBE1D: {
        type: String,
        required: true
    },
    IDBE2: {
        type: String,
        required: true
    },
    IDBE2D: {
        type: String,
        required: true
    },
    IDGV1: {
        type: String,
        required: true
    },
    IDGV1D: {
        type: String,
        required: true
    },
    IDGV2: {
        type: String,
        required: true
    },
    IDGV2D: {
        type: String,
        required: true
    },
    IDGV3: {
        type: String,
        required: true
    },
    IDGV3D: {
        type: String,
        required: true
    },
    IDGV4: {
        type: String,
        required: true
    },
    IDGV4D: {
        type: String,
        required: true
    },
    IDRA1: {
        type: String,
        required: true
    },
    IDRA1D: {
        type: String,
        required: true
    },
    IDRA2: {
        type: String,
        required: true
    },
    IDRA2D: {
        type: String,
        required: true
    },
    IDRA3: {
        type: String,
        required: true
    },
    IDRA3D: {
        type: String,
        required: true
    },
    IDRA4: {
        type: String,
        required: true
    },
    IDRA4D: {
        type: String,
        required: true
    },
    IDRM1: {
        type: String,
        required: true
    },
    IDRM1D: {
        type: String,
        required: true
    },
    IDRM2: {
        type: String,
        required: true
    },
    IDRM2D: {
        type: String,
        required: true
    },
    IDSC1: {
        type: String,
        required: true
    },
    IDSC1D: {
        type: String,
        required: true
    },
    IDSC2: {
        type: String,
        required: true
    },
    IDSC2D: {
        type: String,
        required: true
    },
    IDSC3: {
        type: String,
        required: true
    },
    IDSC3D: {
        type: String,
        required: true
    },
    isc1sr: {
        type: String,
        required: true
    },
    isc1risk: {
        type: String,
        required: true
    },
    isc2sr: {
        type: String,
        required: true
    },
    isc2risk: {
        type: String,
        required: true
    },
    isc3sr: {
        type: String,
        required: true
    },
    isc3risk: {
        type: String,
        required: true
    },
    isc4sr: {
        type: String,
        required: true
    },
    isc4risk: {
        type: String,
        required: true
    },
    isc5sr: {
        type: String,
        required: true
    },
    isc5risk: {
        type: String,
        required: true
    },
    isc6sr: {
        type: String,
        required: true
    },
    isc6risk: {
        type: String,
        required: true
    },
    ior: {
        type: String,
        required: true
    },
    ioml: {
        type: String,
        required: true
    },
    iorm: {
        type: String,
        required: true
    },
    create_date: {
        type: Date,
        default: Date.now
    }
});

//Exporting the file
var IdentifyScore = module.exports = mongoose.model('IdentifyScoreCollection', identifyscoreSchema); //Binding schema to StudentCollection

//Inserting student Details
module.exports.addIdentifyScore = function(identifyscore, callback) {
  console.log("IDENTIFY PHASE data saving");
    IdentifyScore.create(identifyscore, callback);
}

module.exports.getUserById = function(_id, callback) {
    IdentifyScore.findById(_id, callback);
}
