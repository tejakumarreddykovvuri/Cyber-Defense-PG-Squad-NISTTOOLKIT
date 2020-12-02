const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

//Importing schema js files
//Identify schema
var IdentifyScore = require('../models/identifyschema');

//Protect schema
var ProtectScore = require('../models/protectschema');

//Detect schema
var DetectScore = require('../models/detectschema');

//Respond schema
var RespondScore = require('../models/respondschema');

//Recover schema
var RecoverScore = require('../models/recoverschema');

//Recommendations Schema
var Rec = require('../models/shortrecommendationsschema');
var Rec2 = require('../models/mediumrecommendationsschema');
var Rec3 = require('../models/longrecommendationsschema');

//for IDENTITY subcategories total question weight
var isc1tw=20,isc2tw=10,isc3tw=14,isc4tw=16,isc5tw=4,isc6tw=8, isctotalw=72;

//for PROTECT subcategories total question weight
var psc1tw=20,psc2tw=12,psc3tw=34,psc4tw=22,psc5tw=4,psc6tw=22,psctotalw=114;

//for DETECT subcategories total question weight
var dsc1tw=14,dsc2tw=40,dsc3tw=24,dsctotalw=78;

//for RESPOND subcategories total question weight
var rsc1tw=6,rsc2tw=20,rsc3tw=14,rsc4tw=12,rsc5tw=10,rsctotalw=62;

//for RECOVER subcategories total question weight
var resc1tw=12,resc2tw=8,resc3tw=10,restotalw=30;

//for IDENTIFY subcategories client response to questions weight total
var isc1cts=0,isc2cts=0,isc3cts=0,isc4cts=0,isc5cts=0,isc6cts=0;

//for PROTECT subcategories client response to questions weight total
var psc1cts=0,psc2cts=0,psc3cts=0,psc4cts=0,psc5cts=0,psc6cts=0;

//for DETECT subcategories client response to questions weight total
var dsc1cts=0,dsc2cts=0,dsc3cts=0;

//for RESPOND subcategories client response to questions weight total
var rsc1cts=0,rsc2cts=0,rsc3cts=0,rsc4cts=0,rsc5cts=0;

//for RECOVER subcategories client response to questions weight total
var resc1cts=0,resc2cts=0,resc3cts=0;

// for calculating overall score of each PHASE
var iscac=0,pscac=0,dscac=0,rscac=0,resac=0;

//for storing overall score for each phase
var ior=0,por=0,dor=0,ror=0,reor=0;
//for storing overall maturity level for each phase
var iorm=0,porm=0,dorm=0,rorm=0,reorm=0;

//for storing overall maturity level for each phase
var ioml,poml,doml,roml,reoml;

//for calulating clientscore by total weight of subcategory in each PHASE
//for IDENTIFY PHASE
var isc1sr=0;isc2sr=0;isc3sr=0,isc4sr=0,isc5sr=0,isc6sr=0;
//for maturity of each sub category in Identify PHASE
var isc1srm=0,isc2srm=0,isc4srm=0,isc5srm=0,isc6srm=0;

//for PROTECT PHASE
var psc1sr=0;psc2sr=0;psc3sr=0,psc4sr=0,psc5sr=0,psc6sr=0;
//for maturity of each sub category in PROTECT PHASE
var psc1srm=0;psc2srm=0;psc3srm=0,psc4srm=0,psc5srm=0,psc6srm=0;

//for DETECT PHASE
var dsc1sr=0,dsc2sr=0,dsc3sr=0;
//for maturity of each sub category in DETECT PHASE
var dsc1srm=0,dsc2srm=0,dsc3srm=0;

//for RESPOND PHASE
var rsc1sr=0,rsc2sr=0,rsc3sr=0,rsc4sr=0,rsc5sr=0;
//for maturity of each sub category in RESPOND PHASE
var rsc1srm=0,rsc2srm=0,rsc3srm=0,rsc4srm=0,rsc5srm=0;

//for RECOVER PHASE
var resc1sr=0,resc2sr=0,resc3sr=0;
//for maturity of each sub category in RECOVER PHASE
var resc1srm=0,resc2srm=0,resc3srm=0;

//for risks of subcategories in each phase
//for IDENTITY PHASE
var isc1risk,isc2risk,isc3risk,isc4risk,isc5risk,isc6risk;

//for PROTECT PHASE
var psc1risk,psc2risk,psc3risk,psc4risk,psc5risk,psc6risk;

//for DETECT PHASE
var dsc1risk,dsc2risk,dsc3risk;

//for RESPOND PHASE
var rsc1risk,rsc2risk,rsc3risk,rsc4risk,rsc5risk;

//for RECOVER PHASE
var resc1risk,resc2risk,resc3risk;

//weights
var w1=1,w2=2,w3=3;

//weights for each question multiplied by the value of response or answer of each question
//weight variables for storing calculated weights according to question response in Identify Phase
var wi1=0,wi2=0,wi3=0,wi4=0,wi5=0,wi6=0,wi7=0,wi8=0,wi9=0,wi10=0,wi11=0,wi12=0,wi13=0,wi14=0,wi15=0,wi16=0,wi17=0,wi18=0,wi19=0;

//weight variables for storing calculated weights according to question response in Protect Phase
var wp1=0,wp2=0,wp3=0,wp4=0,wp5=0,wp6=0,wp7=0,wp8=0,wp9=0,wp10=0,wp11=0,wp12=0,wp13=0,wp14=0,wp15=0,wp16=0,wp17=0,wp18=0,wp19=0,wp20=0,wp21=0,wp22=0,wp23=0,wp24=0,wp25=0,wp26=0,wp27=0;

//weight variables for storing calculated weights according to question response in Detect Phase
var wd1=0,wd2=0,wd3=0,wd4=0,wd5=0,wd6=0,wd7=0,wd8=0,wd9=0,wd10=0,wd11=0,wd12=0,wd13=0,wd14=0,wd15=0,wd16=0,wd17=0;

//weight variables for storing calculated weights according to question response in Respond Phase
var wr1=0,wr2=0,wr3=0,wr4=0,wr5=0,wr6=0,wr7=0,wr8=0,wr9=0,wr10=0,wr11=0,wr12=0;

//weight variables for storing calculated weights according to question response in Recover Phase
var wre1=0,wre2=0,wre3=0,wre4=0,wre5=0,wre6=0,wre7=0;

//for score of RECOMMENDATIONS
//weight variables for storing calculated weights according to question and  difficulty in Identify Phase
var wis1=0,wis2=0,wis3=0,wis4=0,wis5=0,wis6=0,wis7=0,wis8=0,wis9=0,wis10=0,wis11=0,wis12=0,wis13=0,wis14=0,wis15=0,wis16=0,wis17=0,wis18=0,wis19=0;

//weight variables for storing calculated weights according to question and difficulty in Protect Phase
var wps1=0,wps2=0,wps3=0,wps4=0,wps5=0,wps6=0,wps7=0,wps8=0,wps9=0,wps10=0,wps11=0,wps12=0,wps13=0,wps14=0,wps15=0,wps16=0,wps17=0,wps18=0,wps19=0,wps20=0,wps21=0,wps22=0,wps23=0,wps24=0,wps25=0,wps26=0,wps27=0;

//weight variables for storing calculated weights according to question and difficulty in Detect Phase
var wds1=0,wds2=0,wds3=0,wds4=0,wds5=0,wds6=0,wds7=0,wds8=0,wds9=0,wds10=0,wds11=0,wds12=0,wds13=0,wds14=0,wds15=0,wds16=0,wds17=0;

//weight variables for storing calculated weights according to question and difficulty in Respond Phase
var wrs1=0,wrs2=0,wrs3=0,wrs4=0,wrs5=0,wrs6=0,wrs7=0,wrs8=0,wrs9=0,wrs10=0,wrs11=0,wrs12=0;

//weight variables for storing calculated weights according to question and difficulty in Recover Phase
var wres1=0,wres2=0,wres3=0,wres4=0,wres5=0,wres6=0,wres7=0;


// first Page
router.get('/', forwardAuthenticated, (req, res) => res.render('signup'));

// Index
router.get('/index', ensureAuthenticated, (req, res) =>
  res.render('index', {
    user: req.user
  })
);

// clients
router.get('/clients', ensureAuthenticated, (req, res) =>
  res.render('clients', {
    user: req.user
  })
);

// Assessment Questionnaire
router.get('/aq', ensureAuthenticated, (req, res) =>
  res.render('Assessment Questionnaire', {
    user: req.user
  })
);

// User-Account
router.get('/ua', ensureAuthenticated, (req, res) =>
  res.render('User-Account', {
    user: req.user
  })
);

// SHORT TERM Recommendations Storing page
router.get('/recs', ensureAuthenticated, (req, res) =>
  res.render('recs', {
    user: req.user
  })
);

//storing SHORT TERM recommendations
router.post('/api/recs', function(req, res) {
	var _id=req.body._id;
	console.log(_id);
	var rec=req.body.rec;
	console.log(rec);
  rec={
  _id : _id,
  rec: rec
  }
  Rec.addRec(rec, function(err, recs) {
        if (recs) {
           response = {
                "result": "Data inserted succesfully"
            }
            console.log(response);
        } else {
           error = {
                "error": "Sorry insertion failed"
            }
            console.log(error);
        }
    });
});

// MEDIUM TERM Recommendations Storing page
router.get('/recs2', ensureAuthenticated, (req, res) =>
  res.render('recs2', {
    user: req.user
  })
);

//storing MEDIUM TERM recommendations
router.post('/api/recs2', function(req, res) {
	var _id=req.body._id;
	console.log(_id);
	var rec=req.body.rec;
	console.log(rec);
  rec={
  _id : _id,
  rec: rec
  }
  Rec2.addRec(rec, function(err, recs) {
        if (recs) {
           response = {
                "result": "Data inserted succesfully"
            }
            console.log(response);
        } else {
           error = {
                "error": "Sorry insertion failed"
            }
            console.log(error);
        }
    });
});

// LONG TERM Recommendations Storing page
router.get('/recs3', ensureAuthenticated, (req, res) =>
  res.render('recs3', {
    user: req.user
  })
);

//storing LONG TERM recommendations
router.post('/api/recs3', function(req, res) {
	var _id=req.body._id;
	console.log(_id);
	var rec=req.body.rec;
	console.log(rec);
  rec={
  _id : _id,
  rec: rec
  }
  Rec3.addRec(rec, function(err, recs) {
        if (recs) {
           response = {
                "result": "Data inserted succesfully"
            }
            console.log(response);
        } else {
           error = {
                "error": "Sorry insertion failed"
            }
            console.log(error);
        }
    });
});

// Identify
router.get('/identify', ensureAuthenticated, (req, res) =>
  res.render('Identify-Phase', {
    user: req.user
  })
);

//Calculation of IDENTIFY PHASE
router.post('/api/identify', function(req, res) {
	console.log("IDENTIFY PHASE");
	var i1=parseInt(req.body.i1);
	console.log(i1);
	var i2=parseInt(req.body.i2);
	console.log(i2);
	var i3=parseInt(req.body.i3);
	console.log(i3);
	var i4=parseInt(req.body.i4);
	console.log(i4);
	var i5=parseInt(req.body.i5);
	console.log(i5);
	var i6=parseInt(req.body.i6);
	console.log(i6);
	var i7=parseInt(req.body.i7);
	console.log(i7);
	var i8=parseInt(req.body.i8);
	console.log(i8);
	var i9=parseInt(req.body.i9);
	console.log(i9);
	var i10=parseInt(req.body.i10);
	console.log(i10);
	var i11=parseInt(req.body.i11);
	console.log(i11);
	var i12=parseInt(req.body.i12);
	console.log(i12);
	var i13=parseInt(req.body.i13);
	console.log(i13);
	var i14=parseInt(req.body.i14);
	console.log(i14);
	var i15=parseInt(req.body.i15);
	console.log(i15);
	var i16=parseInt(req.body.i16);
	console.log(i16);
	var i17=parseInt(req.body.i17);
	console.log(i17);
	var i18=parseInt(req.body.i18);
	console.log(i18);
	var i19=parseInt(req.body.i19);
	console.log(i19);
	console.log("Identify Difficulty selections");
  var id1=parseInt(req.body.id1);
  console.log(id1);
  var id2=parseInt(req.body.id2);
  console.log(id2);
  var id3=parseInt(req.body.id3);
  console.log(id3);
  var id4=parseInt(req.body.id4);
  console.log(id4);
  var id5=parseInt(req.body.id5);
  console.log(id5);
  var id6=parseInt(req.body.id6);
  console.log(id6);
  var id7=parseInt(req.body.id7);
  console.log(id7);
  var id8=parseInt(req.body.id8);
  console.log(id8);
  var id9=parseInt(req.body.id9);
  console.log(id9);
  var id10=parseInt(req.body.id10);
  console.log(id10);
  var id11=parseInt(req.body.id11);
  console.log(id11);
  var id12=parseInt(req.body.id12);
  console.log(id12);
  var id13=parseInt(req.body.id13);
  console.log(id13);
  var id14=parseInt(req.body.id14);
  console.log(id14);
  var id15=parseInt(req.body.id15);
  console.log(id15);
  var id16=parseInt(req.body.id16);
  console.log(id16);
  var id17=parseInt(req.body.id17);
  console.log(id17);
  var id18=parseInt(req.body.id18);
  console.log(id18);
  var id19=parseInt(req.body.id19);
  console.log(id19);
  wi1=w3*i1;
  wi2=w2*i2;
  wi3=w2*i3;
  wi4=w3*i4;
  isc1cts= wi1+wi2+wi3+wi4;
  console.log("TOTAL CLIENT RESPONSE OF SUBCATEGORY-1 OF IDENTIFY PHASE:" + isc1cts);
  isc1sr= (isc1cts/isc1tw);
  isc1sr= isc1sr.toFixed(2);
  console.log("TOTAL MAXIUM SCORE FOR SUBCATEGORY-1 OF IDENTIFY PAHSE IS:" + isc1tw);
  console.log("TOTAL RISK SCORING OF CLIENT FOR SUBCATEGORY-1 OF IDENTIFY PHASE IS:" + isc1sr);
  isc1srm=isc1sr*100;
  isc1srm=Math.round(isc1srm);
  console.log("maturity of sub-cat-1 of identify Phase:"+isc1srm);
  if(isc1srm>=0 && isc1srm <=40){
    isc1risk = "HIGH RISK";
  }
  else if(isc1srm>40 && isc1srm<=75){
    isc1risk = "MEDIUM RISK";
  }
  else {
    isc1risk="MINIMUM RISK";
  }
  console.log(isc1risk);
  wi5=w2*i5;
  wi6=w3*i6;
  isc2cts= wi5+wi6;
  console.log("TOTAL CLIENT RESPONSE OF SUBCATEGORY-2 OF IDENTIFY PHASE:" + isc2cts);
  isc2sr= (isc2cts/isc2tw);
  isc2sr=isc2sr.toFixed(2);
  console.log("TOTAL MAXIUM SCORE FOR SUBCATEGORY-2 OF IDENTIFY PAHSE IS:" + isc2tw);
  console.log("TOTAL RISK SCORING OF CLIENT FOR SUBCATEGORY-2 OF IDENTIFY PHASE IS:" + isc2sr);
  isc2srm=isc2sr*100;
  isc2srm=Math.round(isc2srm);
  console.log("maturity of sub-cat-2 of identify Phase:"+isc2srm);
  if(isc2srm >=0 && isc2srm <=40){
    isc2risk = "HIGH RISK";
  }
  else if(isc2srm >40 && isc2srm <=75){
    isc2risk = "MEDIUM RISK";
  }
  else {
    isc2risk="MINIMUM RISK";
  }
  console.log(isc2risk);
  wi7=w3*i7;
  wi8=w2*i8;
  wi9=w1*i9;
  wi10=w1*i10;
  isc3cts= wi7+wi8+wi9+wi10;
  console.log("TOTAL CLIENT RESPONSE OF SUBCATEGORY-3 OF IDENTIFY PHASE:" + isc3cts);
  isc3sr= (isc3cts/isc3tw);
  isc3sr=isc3sr.toFixed(2);
  console.log("TOTAL MAXIUM SCORE FOR SUBCATEGORY-3 OF IDENTIFY PAHSE IS:" + isc3tw);
  console.log("TOTAL RISK SCORING OF CLIENT FOR SUBCATEGORY-3 OF IDENTIFY PHASE IS:" + isc3sr);
  isc3srm=isc3sr*100;
  isc3srm=Math.round(isc3srm);
  console.log("maturity of sub-cat-3 of identify Phase:"+isc3srm);
  if(isc3srm >=0 && isc3srm <40){
    isc3risk = "HIGH RISK";
  }
  else if(isc3srm>40 && isc3srm<=75){
    isc3risk = "MEDIUM RISK";
  }
  else {
    isc3risk="MINIMUM RISK";
  }
  console.log(isc3risk);
  wi11=w2*i11;
  wi12=w3*i12;
  wi13=w2*i13;
  wi14=w1*i14;
  isc4cts= wi11+wi12+wi13+wi14;
  console.log("TOTAL CLIENT RESPONSE OF SUBCATEGORY-4 OF IDENTIFY PHASE:" + isc4cts);
  isc4sr= (isc4cts/isc4tw);
  isc4sr=isc4sr.toFixed(2);
  console.log("TOTAL MAXIUM SCORE FOR SUBCATEGORY-4 OF IDENTIFY PAHSE IS:" + isc4tw);
  console.log("TOTAL RISK SCORING OF CLIENT FOR SUBCATEGORY-4 OF IDENTIFY PHASE IS:" + isc4sr);
  isc4srm=isc4sr*100;
  isc4srm=Math.round(isc4srm);
  console.log("maturity of sub-cat-4 of identify Phase:"+isc4srm);
  if(isc4srm >=0 && isc4srm <=40){
    isc4risk = "HIGH RISK";
  }
  else if(isc4srm >40 && isc4srm <=75){
    isc4risk = "MEDIUM RISK";
  }
  else {
    isc4risk="MINIMUM RISK";
  }
  console.log(isc4risk);
  wi15=w1*i15;
  wi16=w1*i16;
  isc5cts= wi15+wi16;
  console.log("TOTAL CLIENT RESPONSE OF SUBCATEGORY-5 OF IDENTIFY PHASE:" + isc5cts);
  isc5sr= (isc5cts/isc5tw);
  isc5sr=isc5sr.toFixed(2);
  console.log("TOTAL MAXIUM SCORE FOR SUBCATEGORY-5 OF IDENTIFY PAHSE IS:" + isc5tw);
  console.log("TOTAL RISK SCORING OF CLIENT FOR SUBCATEGORY-5 OF IDENTIFY PHASE IS:" + isc5sr);
  isc5srm=isc5sr*100;
  isc5srm=Math.round(isc5srm);
  console.log("maturity of sub-cat-5 of identify Phase:"+isc5srm);
  if(isc5srm >=0 && isc5srm <=40){
    isc5risk = "HIGH RISK";
  }
  else if(isc5srm >40 && isc5srm<=75){
    isc5risk = "MEDIUM RISK";
  }
  else {
    isc5risk="MINIMUM RISK";
  }
  console.log(isc5risk);
  wi17=w1*i17;
  wi18=w2*i18;
  wi19=w1*i19;
  isc6cts= wi17+wi18+wi19;
  console.log("TOTAL CLIENT RESPONSE OF SUBCATEGORY-6 OF IDENTIFY PHASE:" + isc6cts);
  isc6sr= (isc6cts/isc6tw);
  isc6sr=isc6sr.toFixed(2);
  console.log("TOTAL MAXIUM SCORE FOR SUBCATEGORY-6 OF IDENTIFY PAHSE IS:" + isc6tw);
  console.log("TOTAL RISK SCORING OF CLIENT FOR SUBCATEGORY-6 OF IDENTIFY PHASE IS:" + isc6sr);
  isc6srm=isc6sr*100;
  isc6srm=Math.round(isc6srm);
  console.log("maturity of sub-cat-6 of identify Phase:"+isc6srm);
  if(isc6srm>=0 && isc6srm <=40){
    isc6risk = "HIGH RISK";
  }
  else if(isc6srm>40 && isc6srm<=75){
    isc6risk = "MEDIUM RISK";
  }
  else {
    isc6risk="MINIMUM RISK";
  }
  console.log(isc6risk);
  iscac=isc1cts+isc2cts+isc3cts+isc4cts+isc5cts+isc6cts;
  console.log("OVERALL SCORE OF EACH SUBCATEGORY OF IDENTIFY PHASE IS:" + iscac);
  ior=(iscac/isctotalw);
  ior=ior.toFixed(2);
  console.log("OVERALL SCORE OF IDENTIFY PHASE IS:" + ior);
  iorm=ior*100;
  iorm=Math.round(iorm);
  if(iorm>=0 && iorm<=40){
    ioml = "HIGH RISK";
  }
  else if(iorm>40 && iorm<=75){
    ioml = "MEDIUM RISK";
  }
  else {
    ioml ="MINIMUM RISK";
  }
  console.log("OVERALL RISK OF IDENTIFY PHASE IS:" + ioml);
  //claculation of difficulty in Identify Phase
  wis1=((2-i1)*(4-id1)*w3);
  console.log(wis1);
  wis2=((2-i2)*(4-id2)*w2);
  console.log(wis2);
	wis3=((2-i3)*(4-id3)*w2);
  console.log(wis3);
	wis4=((2-i4)*(4-id4)*w3);
  console.log(wis4);
	wis5=((2-i5)*(4-id5)*w2);
  console.log(wis5);
	wis6=((2-i6)*(4-id6)*w3);
  console.log(wis6);
  wis7=((2-i7)*(4-id7)*w3);
  console.log(wis7);
	wis8=((2-i8)*(4-id8)*w2);
  console.log(wis8);
	wis9=((2-i9)*(4-id9)*w1);
  console.log(wis9);
	wis10=((2-i10)*(4-id10)*w1);
  console.log(wis10);
	wis11=((2-i11)*(4-id11)*w2);
  console.log(wis11);
  wis12=((2-i12)*(4-id12)*w3);
  console.log(wis12);
	wis13=((2-i13)*(4-id13)*w2);
  console.log(wis13);
	wis14=((2-i14)*(4-id14)*w1);
  console.log(wis14);
	wis15=((2-i15)*(4-id15)*w1);
  console.log(wis15);
	wis16=((2-i16)*(4-id16)*w1);
  console.log(wis16);
  wis17=((2-i17)*(4-id17)*w1);
  console.log(wis17);
	wis18=((2-i18)*(4-id18)*w2);
  console.log(wis18);
	wis19=((2-i19)*(4-id19)*w1);
  console.log(wis19);
  wiss={wis1,wis2,wis3,wis4,wis5,wis6,wis7,wis8,wis9,wis10,wis11,wis12,wis13,wis14,wis15,wis16,wis17,wis18,wis19};
	var inumval=[i1,i2,i3,i4,i5,i6,i7,i8,i9,i10,i11,i12,i13,i14,i15,i16,i17,i18,i19];
	var i=[i1,i2,i3,i4,i5,i6,i7,i8,i9,i10,i11,i12,i13,i14,i15,i16,i17,i18,i19];
	inum={
	  i : inumval
	}
	console.log(inum);
	for(j=0;j<i.length;j++){
	if(i[j]==0)
	  i[j]="NOT IMPLEMENTED";
	else if(i[j]==1)
	  i[j]="PARTIALLY IMPLEMENTED";
	else
	  i[j]="FULLY IMPLEMENTED";
	}
	console.log(i);
	identifyscore={
	  _id: req.user.email,
	  IDAM1: i[0],
	  IDAM1D: id1,
	  IDAM2: i[1],
	  IDAM2D: id2,
	  IDAM3: i[2],
	  IDAM3D: id3,
	  IDAM4: i[3],
	  IDAM4D: id4,
	  IDBE1: i[4],
	  IDBE1D:id5,
	  IDBE2: i[5],
	  IDBE2D: id6,
	  IDGV1: i[6],
	  IDGV1D: id7,
	  IDGV2: i[7],
	  IDGV2D: id8,
	  IDGV3: i[8],
	  IDGV3D: id9,
	  IDGV4: i[9],
	  IDGV4D: id10,
	  IDRA1: i[10],
	  IDRA1D: id11,
	  IDRA2: i[11],
	  IDRA2D: id12,
	  IDRA3: i[12],
	  IDRA3D: id13,
	  IDRA4: i[13],
	  IDRA4D: id14,
	  IDRM1: i[14],
	  IDRM1D: id15,
	  IDRM2: i[15],
	  IDRM2D: id16,
	  IDSC1: i[16],
	  IDSC1D:id17,
	  IDSC2: i[17],
	  IDSC2D: id18,
	  IDSC3: i[18],
	  IDSC3D: id19,
	  isc1sr:isc1sr,
	  isc1risk:isc1risk,
	  isc2sr:isc2sr,
	  isc2risk:isc2risk,
	  isc3sr:isc3sr,
	  isc3risk:isc3risk,
	  isc4sr:isc4sr,
	  isc4risk:isc4risk,
	  isc5sr:isc5sr,
	  isc5risk:isc5risk,
	  isc6sr:isc6sr,
	  isc6risk:isc6risk,
	  ior:ior,
	  ioml:ioml,
	  iorm:iorm
	}
	IdentifyScore.addIdentifyScore(identifyscore, function(err, identifyscore) {
		  if (identifyscore) {
			 response = {
				  "result": "Data inserted succesfully"
			  }
			  console.log(response);
		  } else {
			 error = {
				  "error": "Sorry insertion failed"
			  }
			  console.log(error);
		  }
	  });
});

// Protect
router.get('/protect', ensureAuthenticated, (req, res) =>
  res.render('Protect-Phase', {
    user: req.user
  })
);

//Calculation of PROTECT PHASE
router.post('/api/protect', function(req, res) {
  console.log("PROTECT PHASE");
  var p1=parseInt(req.body.p1);
  console.log(p1);
  var p2=parseInt(req.body.p2);
  console.log(p2);
  var p3=parseInt(req.body.p3);
  console.log(p3);
  var p4=parseInt(req.body.p4);
  console.log(p4);
  var p5=parseInt(req.body.p5);
  console.log(p5);
  var p6=parseInt(req.body.p6);
  console.log(p6);
  var p7=parseInt(req.body.p7);
  console.log(p7);
  var p8=parseInt(req.body.p8);
  console.log(p8);
  var p9=parseInt(req.body.p9);
  console.log(p9);
  var p10=parseInt(req.body.p10);
  console.log(p10);
  var p11=parseInt(req.body.p11);
  console.log(p11);
  var p12=parseInt(req.body.p12);
  console.log(p12);
  var p13=parseInt(req.body.p13);
  console.log(p13);
  var p14=parseInt(req.body.p14);
  console.log(p14);
  var p15=parseInt(req.body.p15);
  console.log(p15);
  var p16=parseInt(req.body.p16);
  console.log(p16);
  var p17=parseInt(req.body.p17);
  console.log(p17);
  var p18=parseInt(req.body.p18);
  console.log(p18);
  var p19=parseInt(req.body.p19);
  console.log(p19);
  var p20=parseInt(req.body.p20);
  console.log(p20);
  var p21=parseInt(req.body.p21);
  console.log(p21);
  var p22=parseInt(req.body.p22);
  console.log(p22);
  var p23=parseInt(req.body.p23);
  console.log(p23);
  var p24=parseInt(req.body.p24);
  console.log(p24);
  var p25=parseInt(req.body.p25);
  console.log(p25);
  var p26=parseInt(req.body.p26);
  console.log(p26);
  var p27=parseInt(req.body.p27);
  console.log(p27);
  console.log("Protect Difficulty selections");
  var pd1=parseInt(req.body.pd1);
  console.log(pd1);
  var pd2=parseInt(req.body.pd2);
  console.log(pd2);
  var pd3=parseInt(req.body.pd3);
  console.log(pd3);
  var pd4=parseInt(req.body.pd4);
  console.log(pd4);
  var pd5=parseInt(req.body.pd5);
  console.log(pd5);
  var pd6=parseInt(req.body.pd6);
  console.log(pd6);
  var pd7=parseInt(req.body.pd7);
  console.log(pd7);
  var pd8=parseInt(req.body.pd8);
  console.log(pd8);
  var pd9=parseInt(req.body.pd9);
  console.log(pd9);
  var pd10=parseInt(req.body.pd10);
  console.log(pd10);
  var pd11=parseInt(req.body.pd11);
  console.log(pd11);
  var pd12=parseInt(req.body.pd12);
  console.log(pd12);
  var pd13=parseInt(req.body.pd13);
  console.log(pd13);
  var pd14=parseInt(req.body.pd14);
  console.log(pd14);
  var pd15=parseInt(req.body.pd15);
  console.log(pd15);
  var pd16=parseInt(req.body.pd16);
  console.log(pd16);
  var pd17=parseInt(req.body.pd17);
  console.log(pd17);
  var pd18=parseInt(req.body.pd18);
  console.log(pd18);
  var pd19=parseInt(req.body.pd19);
  console.log(pd19);
  var pd20=parseInt(req.body.pd20);
  console.log(pd20);
  var pd21=parseInt(req.body.pd21);
  console.log(pd21);
  var pd22=parseInt(req.body.pd22);
  console.log(pd22);
  var pd23=parseInt(req.body.pd23);
  console.log(pd23);
  var pd24=parseInt(req.body.pd24);
  console.log(pd24);
  var pd25=parseInt(req.body.pd25);
  console.log(pd25);
  var pd26=parseInt(req.body.pd26);
  console.log(pd26);
  var pd27=parseInt(req.body.pd27);
  console.log(pd27);
  wp1=w3*p1;
  wp2=w2*p2;
  wp3=w3*p3;
  wp4=w2*p4;
  psc1cts= wp1+wp2+wp3+wp4;
  console.log("TOTAL CLIENT RESPONSE OF SUBCATEGORY-1 OF PROTECT PHASE:" + psc1cts);
  psc1sr= (psc1cts/psc1tw);
  psc1sr=psc1sr.toFixed(2);
  console.log("TOTAL MAXIUM SCORE FOR SUBCATEGORY-1 OF PROTECT PAHSE IS:" + psc1tw);
  console.log("TOTAL RISK SCORING OF CLIENT FOR SUBCATEGORY-1 OF PROTECT PHASE IS:" + psc1sr);
  psc1srm=psc1sr*100;
  psc1srm=Math.round(psc1srm);
  console.log("maturity of sub-cat-1 of protect Phase:"+psc1srm);
  if(psc1srm>=0 && psc1srm <=40){
    psc1risk = "HIGH RISK";
  }
  else if(psc1srm>40 && psc1srm<=75){
    psc1risk = "MEDIUM RISK";
  }
  else {
    psc1risk="MINIMUM RISK";
  }
  console.log(psc1risk);
  wp5=w2*p5;
  wp6=w2*p6;
  wp7=w2*p7;
  psc2cts= wp5+wp6+wp7;
  console.log("TOTAL CLIENT RESPONSE OF SUBCATEGORY-2 OF PROTECT PHASE:" + psc2cts);
  psc2sr= (psc2cts/psc2tw);
  psc2sr=psc2sr.toFixed(2);
  console.log("TOTAL MAXIUM SCORE FOR SUBCATEGORY-2 OF PROTECT PAHSE IS:" + psc2tw);
  console.log("TOTAL RISK SCORING OF CLIENT FOR SUBCATEGORY-2 OF PROTECT PHASE IS:" + psc2sr);
  psc2srm=psc2sr*100;
  psc2srm=Math.round(psc2srm);
  console.log("maturity of sub-cat-2 of protect Phase:"+psc2srm);
  if(psc2srm>=0 && psc2srm <=40){
    psc2risk = "HIGH RISK";
  }
  else if(psc2srm>40 && psc2srm<=75){
    psc2risk = "MEDIUM RISK";
  }
  else {
    psc2risk="MINIMUM RISK";
  }
  console.log(psc2risk);
  wp8=w3*p8;
  wp9=w3*p9;
  wp10=w1*p10;
  wp11=w3*p11;
  wp12=w1*p12;
  wp13=w3*p13;
  wp14=w3*p14;
  psc3cts= wp8+wp9+wp10+wp11+wp12+wp13+wp14;
  console.log("TOTAL CLIENT RESPONSE OF SUBCATEGORY-3 OF PROTECT PHASE:" + psc3cts);
  psc3sr= (psc3cts/psc3tw);
  psc3sr=psc3sr.toFixed(2);
  console.log("TOTAL MAXIUM SCORE FOR SUBCATEGORY-3 OF PROTECT PAHSE IS:" + psc3tw);
  console.log("TOTAL RISK SCORING OF CLIENT FOR SUBCATEGORY-3 OF PROTECT PHASE IS:" + psc3sr);
  psc3srm=psc3sr*100;
  psc3srm=Math.round(psc3srm);
  console.log("maturity of sub-cat-3 of protect Phase:"+psc3srm);
  if(psc3srm>=0 && psc3srm <=40){
    psc3risk = "HIGH RISK";
  }
  else if(psc3srm>40 && psc3srm<=75){
    psc3risk = "MEDIUM RISK";
  }
  else {
    psc3risk="MINIMUM RISK";
  }
  console.log(psc3risk);
  wp15=w1*p15;
  wp16=w3*p16;
  wp17=w1*p17;
  wp18=w1*p18;
  wp19=w3*p19;
  wp20=w2*p20;
  psc4cts= wp15+wp16+wp17+wp18+wp19+wp20;
  console.log("TOTAL CLIENT RESPONSE OF SUBCATEGORY-4 OF PROTECT PHASE:" + psc4cts);
  psc4sr= (psc4cts/psc4tw);
  psc4sr=psc4sr.toFixed(2);
  console.log("TOTAL MAXIUM SCORE FOR SUBCATEGORY-4 OF PROTECT PAHSE IS:" + psc4tw);
  console.log("TOTAL RISK SCORING OF CLIENT FOR SUBCATEGORY-4 OF PROTECT PHASE IS:" + psc4sr);
  psc4srm=psc4sr*100;
  psc4srm=Math.round(psc4srm);
  console.log("maturity of sub-cat-4 of protect Phase:"+psc4srm);
  if(psc4srm>=0 && psc4srm <=40){
    psc4risk = "HIGH RISK";
  }
  else if(psc4srm>40 && psc4srm<=75){
    psc4risk = "MEDIUM RISK";
  }
  else {
    psc4risk="MINIMUM RISK";
  }
  console.log(psc4risk);
  wp21=w1*p21;
  wp22=w1*p22;
  psc5cts= wp21+wp22;
  console.log("TOTAL CLIENT RESPONSE OF SUBCATEGORY-5 OF PROTECT PHASE:" + psc5cts);
  psc5sr= (psc5cts/psc5tw);
  psc5sr=psc5sr.toFixed(2);
  console.log("TOTAL MAXIUM SCORE FOR SUBCATEGORY-5 OF PROTECT PAHSE IS:" + psc5tw);
  console.log("TOTAL RISK SCORING OF CLIENT FOR SUBCATEGORY-5 OF PROTECT PHASE IS:" + psc5sr);
  psc5srm=psc5sr*100;
  psc5srm=Math.round(psc5srm);
  console.log("maturity of sub-cat-5 of protect Phase:"+psc5srm);
  if(psc5srm>=0 && psc5srm <=40){
    psc5risk = "HIGH RISK";
  }
  else if(psc5srm>40 && psc5srm<=75){
    psc5risk = "MEDIUM RISK";
  }
  else {
    psc5risk="MINIMUM RISK";
  }
  console.log(psc5risk);
  wp23=w1*p23;
  wp24=w2*p24;
  wp25=w3*p25;
  wp26=w2*p26;
  wp27=w3*p27;
  psc6cts= wp23+wp24+wp25+wp26+wp27;
  console.log("TOTAL CLIENT RESPONSE OF SUBCATEGORY-6 OF PROTECT PHASE:" + psc6cts);
  psc6sr= (psc6cts/psc6tw);
  psc6sr=psc6sr.toFixed(2);
  console.log("TOTAL MAXIUM SCORE FOR SUBCATEGORY-6 OF PROTECT PAHSE IS:" + psc6tw);
  console.log("TOTAL RISK SCORING OF CLIENT FOR SUBCATEGORY-6 OF PROTECT PHASE IS:" + psc6sr);
  psc6srm=psc6sr*100;
  psc6srm=Math.round(psc6srm);
  console.log("maturity of sub-cat-6 of protect Phase:"+psc6srm);
  if(psc6srm>=0 && psc6srm <=40){
    psc6risk = "HIGH RISK";
  }
  else if(psc6srm>40 && psc6srm<=75){
    psc6risk = "MEDIUM RISK";
  }
  else {
    psc6risk="MINIMUM RISK";
  }
  console.log(psc6risk);
  pscac=psc1cts+psc2cts+psc3cts+psc4cts+psc5cts+psc6cts;
  console.log("OVERALL SCORE OF EACH SUBCATEGORY IN PROTECT PHASE IS:" + pscac);
  por=(pscac/psctotalw);
  por=por.toFixed(2);
  console.log("OVERALL SCORE OF PROTECT PHASE IS:" + por);
  porm=por*100;
  porm=Math.round(porm);
  if(porm>=0 && porm<=40){
    poml = "HIGH RISK";
  }
  else if(porm>40 && porm<=75){
    poml = "MEDIUM RISK";
  }
  else {
    poml ="MINIMUM RISK";
  }
  console.log("OVERALL RISK OF PROTECT PHASE IS:" + poml);
  //claculation of difficulty in Protect Phase
  wps1=((2-p1)*(4-pd1)*w3);
  console.log(wps1);
  wps2=((2-p2)*(4-pd2)*w2);
  console.log(wps2);
  wps3=((2-p3)*(4-pd3)*w3);
  console.log(wps3);
  wps4=((2-p4)*(4-pd4)*w2);
  console.log(wps4);
  wps5=((2-p5)*(4-pd5)*w2);
  console.log(wps5);
  wps6=((2-p6)*(4-pd6)*w2);
  console.log(wps6);
  wps7=((2-p7)*(4-pd7)*w2);
  console.log(wps7);
  wps8=((2-p8)*(4-pd8)*w3);
  console.log(wps8);
  wps9=((2-p9)*(4-pd9)*w3);
  console.log(wps9);
  wps10=((2-p10)*(4-pd10)*w1);
  console.log(wps10);
  wps11=((2-p11)*(4-pd11)*w3);
  console.log(wps11);
  wps12=((2-p12)*(4-pd12)*w1);
  console.log(wps12);
  wps13=((2-p13)*(4-pd13)*w3);
  console.log(wps13);
  wps14=((2-p14)*(4-pd14)*w3);
  console.log(wps14);
  wps15=((2-p15)*(4-pd15)*w1);
  console.log(wps15);
  wps16=((2-p16)*(4-pd16)*w3);
  console.log(wps16);
  wps17=((2-p17)*(4-pd17)*w1);
  console.log(wps17);
  wps18=((2-p18)*(4-pd18)*w1);
  console.log(wps18);
  wps19=((2-p19)*(4-pd19)*w3);
  console.log(wps19);
  wps20=((2-p20)*(4-pd20)*w2);
  console.log(wps20);
  wps21=((2-p21)*(4-pd21)*w1);
  console.log(wps21);
  wps22=((2-p22)*(4-pd22)*w1);
  console.log(wps22);
  wps23=((2-p23)*(4-pd23)*w1);
  console.log(wps23);
  wps24=((2-p24)*(4-pd24)*w2);
  console.log(wps24);
  wps25=((2-p25)*(4-pd25)*w3);
  console.log(wps25);
  wps26=((2-p26)*(4-pd26)*w2);
  console.log(wps26);
  wps27=((2-p27)*(4-pd27)*w3);
  console.log(wps27);
  wpss={wps1,wps2,wps3,wps4,wps5,wps6,wps7,wps8,wps9,wps10,wps11,wps12,wps13,wps14,wps15,wps16,wps17,wps18,wps19,wps20,wps21,wps22,wps23,wps24,wps25,wps26,wps27};
  var p=[p1,p2,p3,p4,p5,p6,p7,p8,p9,p10,p11,p12,p13,p14,p15,p16,p17,p18,p19,p20,p21,p22,p23,p24,p25,p26,p27];
  for(j=0;j<p.length;j++){
  if(p[j]==0)
    p[j]="NOT IMPLEMENTED";
  else if(p[j]==1)
    p[j]="PARTIALLY IMPLEMENTED";
  else
    p[j]="FULLY IMPLEMENTED";
  }
  console.log(p);
  protectscore={
    _id: req.user.email,
    PRAC1: p[0],
    PRAC1D: pd1,
    PRAC2: p[1],
    PRAC2D: pd2,
    PRAC3: p[2],
    PRAC3D: pd3,
    PRAC4: p[3],
    PRAC4D: pd4,
    PRAT1: p[4],
    PRAT1D: pd5,
    PRAT2: p[5],
    PRAT2D: pd6,
    PRAT3: p[6],
    PRAT3D: pd7,
    PRDS1: p[7],
    PRDS1D: pd8,
    PRDS2: p[8],
    PRDS2D: pd9,
    PRDS3: p[9],
    PRDS3D: pd10,
    PRDS4: p[10],
    PRDS4D: pd11,
    PRDS5: p[11],
    PRDS5D: pd12,
    PRDS6: p[12],
    PRDS6D: pd13,
    PRDS7: p[13],
    PRDS7D: pd14,
    PRIP1: p[14],
    PRIP1D: pd15,
    PRIP2: p[15],
    PRIP2D: pd16,
    PRIP3: p[16],
    PRIP3D: pd17,
    PRIP4: p[17],
    PRIP4D: pd18,
    PRIP5: p[18],
    PRIP5D: pd19,
    PRIP6: p[19],
    PRIP6D: pd20,
    PRMA1: p[20],
    PRMA1D: pd21,
    PRMA2: p[21],
    PRMA2D: pd22,
    PRPT1: p[22],
    PRPT1D: pd23,
    PRPT2: p[23],
    PRPT2D: pd24,
    PRPT3: p[24],
    PRPT3D: pd25,
    PRPT4: p[25],
    PRPT4D: pd26,
    PRPT5: p[26],
    PRPT5D: pd27,
    psc1sr:psc1sr,
    psc1risk:psc1risk,
    psc2sr:psc2sr,
    psc2risk:psc2risk,
    psc3sr:psc3sr,
    psc3risk:psc3risk,
    psc4sr:psc4sr,
    psc4risk:psc4risk,
    psc5sr:psc5sr,
    psc5risk:psc5risk,
    psc6sr:psc6sr,
    psc6risk:psc6risk,
    por: por,
    poml: poml,
    porm: porm
  }
  console.log(protectscore);
  ProtectScore.addProtectScore(protectscore, function(err, protectscore) {
        if (protectscore) {
           response = {
                "result": "Data inserted succesfully"
            }
            console.log(response);
        } else {
           error = {
                "error": "Sorry insertion failed"
            }
            console.log(error);
        }
    });
});

// Detect
router.get('/detect', ensureAuthenticated, (req, res) =>
  res.render('Detect-Phase', {
    user: req.user
  })
);

//Calculation of DETECT PHASE
router.post('/api/detect', function(req, res) {
	console.log("DETECT PHASE");
	var d1=parseInt(req.body.d1);
	console.log(d1);
	var d2=parseInt(req.body.d2);
	console.log(d2);
	var d3=parseInt(req.body.d3);
	console.log(d3);
	var d4=parseInt(req.body.d4);
	console.log(d4);
	var d5=parseInt(req.body.d5);
	console.log(d5);
	var d6=parseInt(req.body.d6);
	console.log(d6);
	var d7=parseInt(req.body.d7);
	console.log(d7);
	var d8=parseInt(req.body.d8);
	console.log(d8);
	var d9=parseInt(req.body.d9);
	console.log(d9);
	var d10=parseInt(req.body.d10);
	console.log(d10);
	var d11=parseInt(req.body.d11);
	console.log(d11);
	var d12=parseInt(req.body.d12);
	console.log(d12);
	var d13=parseInt(req.body.d13);
	console.log(d13);
	var d14=parseInt(req.body.d14);
	console.log(d14);
	var d15=parseInt(req.body.d15);
	console.log(d15);
	var d16=parseInt(req.body.d16);
	console.log(d16);
	var d17=parseInt(req.body.d17);
	console.log(d17);
	console.log("Detect Difficulty selections");
  var dd1=parseInt(req.body.dd1);
  console.log(dd1);
  var dd2=parseInt(req.body.dd2);
  console.log(dd2);
  var dd3=parseInt(req.body.dd3);
  console.log(dd3);
  var dd4=parseInt(req.body.dd4);
  console.log(dd4);
  var dd5=parseInt(req.body.dd5);
  console.log(dd5);
  var dd6=parseInt(req.body.dd6);
  console.log(dd6);
  var dd7=parseInt(req.body.dd7);
  console.log(dd7);
  var dd8=parseInt(req.body.dd8);
  console.log(dd8);
  var dd9=parseInt(req.body.dd9);
  console.log(dd9);
  var dd10=parseInt(req.body.dd10);
  console.log(dd10);
  var dd11=parseInt(req.body.dd11);
  console.log(dd11);
  var dd12=parseInt(req.body.dd12);
  console.log(dd12);
  var dd13=parseInt(req.body.dd13);
  console.log(dd13);
  var dd14=parseInt(req.body.dd14);
  console.log(dd14);
  var dd15=parseInt(req.body.dd15);
  console.log(dd15);
  var dd16=parseInt(req.body.dd16);
  console.log(dd16);
  var dd17=parseInt(req.body.dd17);
  console.log(dd17);
	wd1=w2*d1;
	wd2=w3*d2;
	wd3=w2*d3;
  dsc1cts= wd1+wd2+wd3;
  console.log("TOTAL CLIENT RESPONSE OF SUBCATEGORY-1 OF DETECT PHASE:" + dsc1cts);
  dsc1sr= (dsc1cts/dsc1tw);
  dsc1sr=dsc1sr.toFixed(2);
  console.log("TOTAL MAXIUM SCORE FOR SUBCATEGORY-1 OF DETECT PAHSE IS:" + dsc1tw);
  console.log("TOTAL RISK SCORING OF CLIENT FOR SUBCATEGORY-1 OF DETECT PHASE IS:" + dsc1sr);
  dsc1srm=dsc1sr*100;
  dsc1srm=Math.round(dsc1srm);
  console.log("maturity of sub-cat-1 of detect Phase:"+dsc1srm);
  if(dsc1srm>=0 && dsc1srm <=40){
    dsc1risk = "HIGH RISK";
  }
  else if(dsc1srm>40 && dsc1srm<=75){
    dsc1risk = "MEDIUM RISK";
  }
  else {
    dsc1risk="MINIMUM RISK";
  }
  console.log(dsc1risk);
  wd4=w3*d4;
  wd5=w2*d5;
	wd6=w3*d6;
	wd7=w3*d7;
	wd8=w3*d8;
	wd9=w1*d9;
	wd10=w3*d10;
	wd11=w2*d11;
  dsc2cts= wd4+wd5+wd6+wd7+wd8+wd9+wd10+wd11;
  console.log("TOTAL CLIENT RESPONSE OF SUBCATEGORY-2 OF DETECT PHASE:" + dsc2cts);
  dsc2sr= (dsc2cts/dsc2tw);
  dsc2sr=dsc2sr.toFixed(2);
  console.log("TOTAL MAXIUM SCORE FOR SUBCATEGORY-2 OF DETECT PAHSE IS:" + dsc2tw);
  console.log("TOTAL RISK SCORING OF CLIENT FOR SUBCATEGORY-2 OF DETECT PHASE IS:" + dsc2sr);
  dsc2srm=dsc2sr*100;
  dsc2srm=Math.round(dsc2srm);
  console.log("maturity of sub-cat-2 of detect Phase:"+dsc2srm);
  if(dsc2srm>=0 && dsc2srm <=40){
    dsc2risk = "HIGH RISK";
  }
  else if(dsc2sr>40 && dsc2sr<=75){
    dsc2risk = "MEDIUM RISK";
  }
  else {
    dsc2risk="MINIMUM RISK";
  }
  console.log(dsc2risk);
  wd12=w2*d12;
	wd13=w1*d13;
	wd14=w1*d14;
	wd15=w3*d15;
	wd16=w3*d16;
	wd17=w2*d17;
  dsc3cts= wd12+wd13+wd14+wd15+wd16+wd17;
  console.log("TOTAL CLIENT RESPONSE OF SUBCATEGORY-3 OF DETECT PHASE:" + dsc3cts);
  dsc3sr= (dsc3cts/dsc3tw);
  dsc3sr=dsc3sr.toFixed(2);
  console.log("TOTAL MAXIUM SCORE FOR SUBCATEGORY-3 OF DETECT PAHSE IS:" + dsc3tw);
  console.log("TOTAL RISK SCORING OF CLIENT FOR SUBCATEGORY-3 OF DETECT PHASE IS:" + dsc3sr);
  dsc3srm=dsc3sr*100;
  dsc3srm=Math.round(dsc3srm);
  console.log("maturity of sub-cat-3 of detect Phase:"+dsc3srm);
  if(dsc3srm>=0 && dsc3srm <=40){
    dsc3risk = "HIGH RISK";
  }
  else if(dsc3srm>40 && dsc3srm<=75){
    dsc3risk = "MEDIUM RISK";
  }
  else {
    dsc3risk="MINIMUM RISK";
  }
  console.log(dsc3risk);
  dscac=dsc1cts+dsc2cts+dsc3cts;
  console.log("OVERALL SCORE OF EACH SUBCATEGORY IN DETECT PHASE IS:" + dscac);
  dor=(dscac/dsctotalw);
  dor=dor.toFixed(2);
  console.log("OVERALL SCORE OF DETECT PHASE IS:" + dor);
  dorm=dor*100;
  dorm=Math.round(dorm);
  if(dorm>=0 && dorm<=40){
    doml = "HIGH RISK";
  }
  else if(dorm>40 && dorm<=75){
    doml = "MEDIUM RISK";
  }
  else {
    doml ="MINIMUM RISK";
  }
  console.log("OVERALL RISK OF DETECT PHASE IS:" + doml);
  //claculation of difficulty in Detect Phase
  wds1=((2-d1)*(4-dd1)*w2);
  console.log(wds1);
	wds2=((2-d2)*(4-dd2)*w3);
  console.log(wds2);
	wds3=((2-d3)*(4-dd3)*w2);
  console.log(wds3);
	wds4=((2-d4)*(4-dd4)*w3);
  console.log(wds4);
	wds5=((2-d5)*(4-dd5)*w2);
  console.log(wds5);
  wds6=((2-d6)*(4-dd6)*w3);
  console.log(wds6);
	wds7=((2-d7)*(4-dd7)*w3);
  console.log(wds7);
	wds8=((2-d8)*(4-dd8)*w3);
  console.log(wds8);
	wds9=((2-d9)*(4-dd9)*w1);
  console.log(wds9);
	wds10=((2-d10)*(4-dd10)*w3);
  console.log(wds10);
	wds11=((2-d11)*(4-dd11)*w2);
  console.log(wds11);
	wds12=((2-d12)*(4-dd12)*w2);
  console.log(wds12);
	wds13=((2-d13)*(4-dd13)*w1);
  console.log(wds13);
	wds14=((2-d14)*(4-dd14)*w1);
  console.log(wds14);
  wds15=((2-d15)*(4-dd15)*w3);
  console.log(wds15);
	wds16=((2-d16)*(4-dd16)*w3);
  console.log(wds16);
	wds17=((2-d17)*(4-dd17)*w2);
  console.log(wds17);
  wdss={wds1,wds2,wds3,wds4,wds5,wds6,wds7,wds8,wds9,wds10,wds11,wds12,wds13,wds14,wds15,wds16,wds17};
  var d=[d1,d2,d3,d4,d5,d6,d7,d8,d9,d10,d11,d12,d13,d14,d15,d16,d17];
  for(j=0;j<d.length;j++){
  if(d[j]==0)
    d[j]="NOT IMPLEMENTED";
  else if(d[j]==1)
    d[j]="PARTIALLY IMPLEMENTED";
  else
    d[j]="FULLY IMPLEMENTED";
  }
  console.log(d);
  detectscore={
    _id: req.user.email,
    DEAE1: d[0],
    DEAE1D: dd1,
    DEAE2: d[1],
    DEAE2D: dd2,
    DEAE3: d[2],
    DEAE3D: dd3,
    DECM1: d[3],
    DECM1D: dd4,
    DECM2: d[4],
    DECM2D: dd5,
    DECM3: d[5],
    DECM3D: dd6,
    DECM4: d[6],
    DECM4D: dd7,
    DECM5: d[7],
    DECM5D: dd8,
    DECM6: d[8],
    DECM6D: dd9,
    DECM7: d[9],
    DECM7D: dd10,
    DECM8: d[10],
    DECM8D: dd11,
    DEDP1: d[11],
    DEDP1D: dd12,
    DEDP2: d[12],
    DEDP2D: dd13,
    DEDP3: d[13],
    DEDP3D: dd14,
    DEDP4: d[14],
    DEDP4D: dd15,
    DEDP5: d[15],
    DEDP5D: dd16,
    DEDP6: d[16],
    DEDP6D: dd17,
    dsc1sr:dsc1sr,
    dsc1risk:dsc1risk,
    dsc2sr:dsc2sr,
    dsc2risk:dsc2risk,
    dsc3sr:dsc3sr,
    dsc3risk:dsc3risk,
    dor: dor,
    doml: doml,
    dorm: dorm
  }
  console.log(detectscore);
  DetectScore.addDetectScore(detectscore, function(err, detectscore) {
        if (detectscore) {
           response = {
                "result": "Data inserted succesfully"
            }
            console.log(response);
        } else {
           error = {
                "error": "Sorry insertion failed"
            }
            console.log(error);
        }
    });
});

// Respond
router.get('/respond', ensureAuthenticated, (req, res) =>
  res.render('Respond-Phase', {
    user: req.user
  })
);

//Calculation of RESPOND PHASE
router.post('/api/respond', function(req, res) {
	console.log("RESPOND PHASE");
	var r1=parseInt(req.body.r1);
	console.log(r1);
	var r2=parseInt(req.body.r2);
	console.log(r2);
	var r3=parseInt(req.body.r3);
	console.log(r3);
	var r4=parseInt(req.body.r4);
	console.log(r4);
	var r5=parseInt(req.body.r5);
	console.log(r5);
	var r6=parseInt(req.body.r6);
	console.log(r6);
	var r7=parseInt(req.body.r7);
	console.log(r7);
	var r8=parseInt(req.body.r8);
	console.log(r8);
	var r9=parseInt(req.body.r9);
	console.log(r9);
	var r10=parseInt(req.body.r10);
	console.log(r10);
	var r11=parseInt(req.body.r11);
	console.log(r11);
  var r12=parseInt(req.body.r12);
  console.log(r12);
  console.log("Respond Difficulty selections");
  var rd1=parseInt(req.body.rd1);
  console.log(rd1);
  var rd2=parseInt(req.body.rd2);
  console.log(rd2);
  var rd3=parseInt(req.body.rd3);
  console.log(rd3);
  var rd4=parseInt(req.body.rd4);
  console.log(rd4);
  var rd5=parseInt(req.body.rd5);
  console.log(rd5);
  var rd6=parseInt(req.body.rd6);
  console.log(rd6);
  var rd7=parseInt(req.body.rd7);
  console.log(rd7);
  var rd8=parseInt(req.body.rd8);
  console.log(rd8);
  var rd9=parseInt(req.body.rd9);
  console.log(rd9);
  var rd10=parseInt(req.body.rd10);
  console.log(rd10);
  var rd11=parseInt(req.body.rd11);
  console.log(rd11);
  var rd12=parseInt(req.body.rd12);
  console.log(rd12);
	wr1=w3*r1;
  rsc1cts= wr1;
  console.log("TOTAL CLIENT RESPONSE OF SUBCATEGORY-1 OF RESPOND PHASE:" + rsc1cts);
  rsc1sr= (rsc1cts/rsc1tw);
  rsc1sr=rsc1sr.toFixed(2);
  console.log("TOTAL MAXIUM SCORE FOR SUBCATEGORY-1 OF RESPOND PAHSE IS:" + rsc1tw);
  console.log("TOTAL RISK SCORING OF CLIENT FOR SUBCATEGORY-1 OF RESPOND PHASE IS:" + rsc1sr);
  rsc1srm=rsc1sr*100;
  rsc1srm=Math.round(rsc1srm);
  console.log("maturity of sub-cat-1 of respond Phase:"+rsc1srm);
  if(rsc1srm>=0 && rsc1srm <=40){
    rsc1risk = "HIGH RISK";
  }
  else if(rsc1srm>40 && rsc1srm<=75){
    rsc1risk = "MEDIUM RISK";
  }
  else {
    rsc1risk="MINIMUM RISK";
  }
  console.log(rsc1risk);
  wr2=w3*r2;
  wr3=w2*r3;
  wr4=w3*r4;
  wr5=w2*r5;
  rsc2cts= wr2+wr3+wr4+wr5;
  console.log("TOTAL CLIENT RESPONSE OF SUBCATEGORY-2 OF RESPOND PHASE:" + rsc2cts);
  rsc2sr= (rsc2cts/rsc2tw);
  rsc2sr=rsc2sr.toFixed(2);
  console.log("TOTAL MAXIUM SCORE FOR SUBCATEGORY-2 OF RESPOND PAHSE IS:" + rsc2tw);
  console.log("TOTAL RISK SCORING OF CLIENT FOR SUBCATEGORY-2 OF RESPOND PHASE IS:" + rsc2sr);
  rsc2srm=rsc2sr*100;
  rsc2srm=Math.round(rsc2srm);
  console.log("maturity of sub-cat-2 of respond Phase:"+rsc2srm);
  if(rsc2srm>=0 && rsc2srm <=40){
    rsc2risk = "HIGH RISK";
  }
  else if(rsc2srm>40 && rsc2srm<=75){
    rsc2risk = "MEDIUM RISK";
  }
  else {
    rsc2risk="MINIMUM RISK";
  }
  console.log(rsc2risk);
  wr6=w2*r6;
  wr7=w3*r7;
  wr8=w2*r8;
  rsc3cts= wr6+wr7+wr8;
  console.log("TOTAL CLIENT RESPONSE OF SUBCATEGORY-3 OF RESPOND PHASE:" + rsc3cts);
  rsc3sr= (rsc3cts/rsc3tw);
  rsc3sr=rsc3sr.toFixed(2);
  console.log("TOTAL MAXIUM SCORE FOR SUBCATEGORY-3 OF RESPOND PAHSE IS:" + rsc3tw);
  console.log("TOTAL RISK SCORING OF CLIENT FOR SUBCATEGORY-3 OF RESPOND PHASE IS:" + rsc3sr);
  rsc3srm=rsc3sr*100;
  rsc3srm=Math.round(rsc3srm);
  console.log("maturity of sub-cat-3 of detect Phase:"+rsc3srm);
  if(rsc3srm>=0 && rsc3srm <=40){
    rsc3risk = "HIGH RISK";
  }
  else if(rsc3srm>40 && rsc3srm<=75){
    rsc3risk = "MEDIUM RISK";
  }
  else {
    rsc3risk="MINIMUM RISK";
  }
  console.log(rsc3risk);
  wr9=w3*r9;
  wr10=w3*r10;
  rsc4cts= wr9+wr10;
  console.log("TOTAL CLIENT RESPONSE OF SUBCATEGORY-4 OF RESPOND PHASE:" + rsc4cts);
  rsc4sr= (rsc4cts/rsc4tw);
  rsc4sr=rsc4sr.toFixed(2);
  console.log("TOTAL MAXIUM SCORE FOR SUBCATEGORY-4 OF RESPOND PAHSE IS:" + rsc4tw);
  console.log("TOTAL RISK SCORING OF CLIENT FOR SUBCATEGORY-4 OF RESPOND PHASE IS:" + rsc4sr);
  rsc4srm=rsc4sr*100;
  rsc4srm=Math.round(rsc4srm);
  console.log("maturity of sub-cat-4 of respond Phase:"+rsc4srm);
  if(rsc4srm>=0 && rsc4srm <=40){
    rsc4risk = "HIGH RISK";
  }
  else if(rsc4srm>40 && rsc4srm<=75){
    rsc4risk = "MEDIUM RISK";
  }
  else {
    rsc4risk="MINIMUM RISK";
  }
  console.log(rsc4risk);
  wr11=w2*r11;
  wr12=w3*r12;
  rsc5cts= wr11+wr12;
  console.log("TOTAL CLIENT RESPONSE OF SUBCATEGORY-5 OF RESPOND PHASE:" + rsc5cts);
  rsc5sr= (rsc5cts/rsc5tw);
  rsc5sr=rsc5sr.toFixed(2);
  console.log("TOTAL MAXIUM SCORE FOR SUBCATEGORY-5 OF RESPOND PAHSE IS:" + rsc5tw);
  console.log("TOTAL RISK SCORING OF CLIENT FOR SUBCATEGORY-5 OF RESPOND PHASE IS:" + rsc5sr);
  rsc5srm=rsc5sr*100;
  rsc5srm=Math.round(rsc5srm);
  console.log("maturity of sub-cat-5 of detect Phase:"+rsc5srm);
  if(rsc5srm>=0 && rsc5srm <=1){
    rsc5risk = "HIGH RISK";
  }
  else if(rsc5srm>1 && rsc5srm<=1.75){
    rsc5risk = "MEDIUM RISK";
  }
  else {
    rsc5risk="MINIMUM RISK";
  }
  console.log(rsc5risk);
  rscac=rsc1cts+rsc2cts+rsc3cts+rsc4cts+rsc5cts;
  console.log("OVERALL SCORE OF EACH SUBCATEGORY IN RESPOND PHASE IS:" + rscac);
  ror=(rscac/rsctotalw);
  ror=ror.toFixed(2);
  console.log("OVERALL RANGE OF RESPOND PHASE IS:" + ror);
  rorm=ror*100;
  rorm=Math.round(rorm);
  if(rorm>=0 && rorm<=40){
    roml = "HIGH RISK";
  }
  else if(rorm>40 && rorm<=75){
    roml = "MEDIUM RISK";
  }
  else {
    roml ="MINIMUM RISK";
  }
  console.log("OVERALL RISK OF RESPOND PHASE IS:" + roml);
  //claculation of difficulty in Respond Phase
  	wrs1=((2-r1)*(4-rd1)*w3);
    console.log(wrs1);
    wrs2=((2-r2)*(4-rd2)*w3);
    console.log(wrs2);
  	wrs3=((2-r3)*(4-rd3)*w2);
    console.log(wrs3);
  	wrs4=((2-r4)*(4-rd4)*w3);
    console.log(wrs4);
  	wrs5=((2-r5)*(4-rd5)*w2);
    console.log(wrs5);
  	wrs6=((2-r6)*(4-rd6)*w2);
    console.log(wrs6);
    wrs7=((2-r7)*(4-rd7)*w3);
    console.log(wrs7);
  	wrs8=((2-r8)*(4-rd8)*w3);
    console.log(wrs8);
  	wrs9=((2-r9)*(4-rd9)*w3);
    console.log(wrs9);
    wrs10=((2-r10)*(4-rd10)*w3);
    console.log(wrs10);
  	wrs11=((2-r11)*(4-rd11)*w2);
    console.log(wrs11);
    wrs12=((2-r12)*(4-rd12)*w3);
    console.log(wrs12);
    wrss={wrs1,wrs2,wrs3,wrs4,wrs5,wrs6,wrs7,wrs8,wrs9,wrs10,wrs11,wrs12};
  var r=[r1,r2,r3,r4,r5,r6,r7,r8,r9,r10,r11,r12];
  for(j=0;j<r.length;j++){
  if(r[j]==0)
    r[j]="NOT IMPLEMENTED";
  else if(r[j]==1)
    r[j]="PARTIALLY IMPLEMENTED";
  else
    r[j]="FULLY IMPLEMENTED";
  }
  console.log(r);
  respondscore={
    _id: req.user.email,
    RSRP1: r[0],
    RSRP1D: rd1,
    RSCO1: r[1],
    RSCO1D: rd2,
    RSCO2: r[2],
    RSCO2D: rd3,
    RSCO3: r[3],
    RSCO3D: rd4,
    RSCO4: r[4],
    RSCO4D: rd5,
    RSAN1: r[5],
    RSAN1D: rd6,
    RSAN2: r[6],
    RSAN2D: rd7,
    RSAN3: r[7],
    RSAN3D: rd8,
    RSMI1: r[8],
    RSMI1D: rd9,
    RSMI2: r[9],
    RSMI2D: rd10,
    RSIM1: r[10],
    RSIM1D: rd11,
    RSIM2: r[11],
    RSIM2D: rd12,
    rsc1sr:rsc1sr,
    rsc1risk:rsc1risk,
    rsc2sr:rsc2sr,
    rsc2risk:rsc2risk,
    rsc3sr:rsc3sr,
    rsc3risk:rsc3risk,
    rsc4sr:rsc4sr,
    rsc4risk:rsc4risk,
    rsc5sr:rsc5sr,
    rsc5risk:rsc5risk,
    ror: ror,
    roml: roml,
    rorm: rorm
  }
  console.log(respondscore);
  RespondScore.addRespondScore(respondscore, function(err, respondscore) {
        if (respondscore) {
           response = {
                "result": "Data inserted succesfully"
            }
            console.log(response);
        } else {
           error = {
                "error": "Sorry insertion failed"
            }
            console.log(error);
        }
    });
});

// Recover
router.get('/recover', ensureAuthenticated, (req, res) =>
  res.render('Recover-Phase', {
    user: req.user
  })
);

//Calculation of RECOVER PHASE
router.post('/api/recover', function(req, res) {
	console.log("RECOVER PHASE");
	var re1=parseInt(req.body.re1);
	console.log(re1);
	var re2=parseInt(req.body.re2);
	console.log(re2);
	var re3=parseInt(req.body.re3);
	console.log(re3);
	var re4=parseInt(req.body.re4);
	console.log(re4);
	var re5=parseInt(req.body.re5);
	console.log(re5);
	var re6=parseInt(req.body.re6);
	console.log(re6);
	var re7=parseInt(req.body.re7);
	console.log(re7);
	console.log("Recover Difficulty selections");
  var red1=parseInt(req.body.red1);
  console.log(red1);
  var red2=parseInt(req.body.red2);
  console.log(red2);
  var red3=parseInt(req.body.red3);
  console.log(red3);
  var red4=parseInt(req.body.red4);
  console.log(red4);
  var red5=parseInt(req.body.red5);
  console.log(red5);
  var red6=parseInt(req.body.red6);
  console.log(red6);
  var red7=parseInt(req.body.red7);
  console.log(red7);
	wre1=w3*re1;
	wre2=w1*re2;
	wre3=w2*re3;
  resc1cts= wre1+wre2+wre3;
  console.log("TOTAL CLIENT RESPONSE OF SUBCATEGORY-1 OF RECOVER PHASE:" + resc1cts);
  resc1sr=(resc1cts/resc1tw);
  resc1sr=resc1sr.toFixed(2);
  console.log("TOTAL MAXIUM SCORE FOR SUBCATEGORY-1 OF RECOVER PAHSE IS:" + resc1tw);
  console.log("TOTAL RISK SCORING OF CLIENT FOR SUBCATEGORY-1 OF RECOVER PHASE IS:" + resc1sr);
  resc1srm=resc1sr*100;
  resc1srm=Math.round(resc1srm);
  console.log("maturity of sub-cat-1 of recover Phase:"+resc1srm);
  if(resc1srm>=0 && resc1srm <=40){
    resc1risk = "HIGH RISK";
  }
  else if(resc1srm>40 && resc1srm<=75){
    resc1risk = "MEDIUM RISK";
  }
  else {
    resc1risk="MINIMUM RISK";
  }
  console.log(resc1risk);
	wre4=w1*re4;
	wre5=w3*re5;
  resc2cts= wre4+wre5;
  console.log("TOTAL CLIENT RESPONSE OF SUBCATEGORY-2 OF RECOVER PHASE:" + resc2cts);
  resc2sr=(resc2cts/resc2tw);
  resc2sr=resc2sr.toFixed(2);
  console.log("TOTAL MAXIUM SCORE FOR SUBCATEGORY-2 OF RECOVER PAHSE IS:" + resc2tw);
  console.log("TOTAL RISK SCORING OF CLIENT FOR SUBCATEGORY-2 OF RECOVER PHASE IS:" + resc2sr);
  resc2srm=resc2sr*100;
  resc2srm=Math.round(resc2srm);
  console.log("maturity of sub-cat-2 of recover Phase:"+resc2srm);
  if(resc2srm>=0 && resc2srm <=40){
    resc2risk = "HIGH RISK";
  }
  else if(resc2srm>40 && resc2srm<=75){
    resc2risk = "MEDIUM RISK";
  }
  else {
    resc2risk="MINIMUM RISK";
  }
  console.log(resc2risk);
  wre6=w3*re6;
  wre7=w2*re7;
  resc3cts= wre6+wre7;
  console.log("TOTAL CLIENT RESPONSE OF SUBCATEGORY-3 OF RECOVER PHASE:" + resc3cts);
  resc3sr= (resc3cts/resc3tw);
  resc3sr=resc3sr.toFixed(2);
  console.log("TOTAL MAXIUM SCORE FOR SUBCATEGORY-3 OF RECOVER PAHSE IS:" + resc3tw);
  console.log("TOTAL RISK SCORING OF CLIENT FOR SUBCATEGORY-3 OF RECOVER PHASE IS:" + resc3sr);
  resc3srm=resc3sr*100;
  resc3srm=Math.round(resc3srm);
  console.log("maturity of sub-cat-3 of respond Phase:"+resc3srm);
  if(resc3srm>=0 && resc3srm <=40){
    resc3risk = "HIGH RISK";
  }
  else if(resc3srm>40 && resc3srm<=75){
    resc3risk = "MEDIUM RISK";
  }
  else {
    resc3risk="MINIMUM RISK";
  }
  console.log(resc3risk);
  rescac=resc1cts+resc2cts+resc3cts;
  console.log("OVERALL SCORE OF EACH SUBCATEGORY IN RECOVER PHASE IS:" + rescac);
  reor=(rescac/restotalw);
  reor=reor.toFixed(2);
  console.log("OVERALL RANGE OF RECOVER PHASE IS:" + reor);
  reorm=reor*100;
  reorm=Math.round(reorm);
  if(reorm>=0 && reorm<=40){
    reoml = "HIGH RISK";
  }
  else if(reorm>40 && reorm<=75){
    reoml = "MEDIUM RISK";
  }
  else {
    reoml ="MINIMUM RISK";
  }
  console.log("OVERALL RISK OF RECOVER PHASE IS:" + reoml);
  //claculation of difficulty in Recover Phase
  wres1=((2-re1)*(4-red1)*w3);
  console.log(wres1);
	wres2=((2-re2)*(4-red2)*w1);
  console.log(wres2);
	wres3=((2-re3)*(4-red3)*w2);
  console.log(wres3);
  wres4=((2-re4)*(4-red4)*w1);
  console.log(wres4);
	wres5=((2-re5)*(4-red5)*w3);
  console.log(wres5);
	wres6=((2-re6)*(4-red6)*w3);
  console.log(wres6);
  wres7=((2-re7)*(4-red7)*w2);
  console.log(wres7);
  wress={wres1,wres2,wres3,wres4,wres5,wres6,wres7};
  var re=[re1,re2,re3,re4,re5,re6,re7];
  for(j=0;j<re.length;j++){
  if(re[j]==0)
    re[j]="NOT IMPLEMENTED";
  else if(re[j]==1)
    re[j]="PARTIALLY IMPLEMENTED";
  else
    re[j]="FULLY IMPLEMENTED";
  }
  console.log(re);
  recoverscore={
    _id: req.user.email,
    RCRP1: re[0],
    RCRP1D: red1,
    RCRP2: re[1],
    RCRP2D: red2,
    RCRP3: re[2],
    RCRP3D: red3,
    RCIM1: re[3],
    RCIM1D: red4,
    RCIM2: re[4],
    RCIM2D: red5,
    RCCO1: re[5],
    RCCO1D: red6,
    RCCO2: re[6],
    RCCO2D: red7,
    resc1sr:resc1sr,
    resc1risk:resc1risk,
    resc2sr:resc2sr,
    resc2risk:resc2risk,
    resc3sr:resc3sr,
    resc3risk:resc3risk,
    reor: reor,
    reoml: reoml,
    reorm: reorm
  }
  RecoverScore.addRecoverScore(recoverscore, function(err, recoverscore) {
        if (recoverscore) {
           response = {
                "result": "Data inserted succesfully"
            }
            console.log(response);
        } else {
           error = {
                "error": "Sorry insertion failed"
            }
            console.log(error);
        }
    });
  data={
    IDAM1: this.wiss.wis1,
    IDAM2: this.wiss.wis2,
    IDAM3: this.wiss.wis3,
    IDAM4: this.wiss.wis4,
    IDBE1: this.wiss.wis5,
    IDBE2: this.wiss.wis6,
    IDGV1: this.wiss.wis7,
    IDGV2: this.wiss.wis8,
    IDGV3: this.wiss.wis9,
    IDGV4: this.wiss.wis10,
    IDRA1: this.wiss.wis11,
    IDRA2: this.wiss.wis12,
    IDRA3: this.wiss.wis13,
    IDRA4: this.wiss.wis14,
    IDRM1: this.wiss.wis15,
    IDRM2: this.wiss.wis16,
    IDSC1: this.wiss.wis17,
    IDSC2: this.wiss.wis18,
    IDSC3: this.wiss.wis19,
    PRAC1: this.wpss.wps1,
    PRAC2: this.wpss.wps2,
    PRAC3: this.wpss.wps3,
    PRAC4: this.wpss.wps4,
    PRAT1: this.wpss.wps5,
    PRAT2: this.wpss.wps6,
    PRAT3: this.wpss.wps7,
    PRDS1: this.wpss.wps8,
    PRDS2: this.wpss.wps9,
    PRDS3: this.wpss.wps10,
    PRDS4: this.wpss.wps11,
    PRDS5: this.wpss.wps12,
    PRDS6: this.wpss.wps13,
    PRDS7: this.wpss.wps14,
    PRIP1: this.wpss.wps15,
    PRIP2: this.wpss.wps16,
    PRIP3: this.wpss.wps17,
    PRIP4: this.wpss.wps18,
    PRIP5: this.wpss.wps19,
    PRIP6: this.wpss.wps20,
    PRMA1: this.wpss.wps21,
    PRMA2: this.wpss.wps22,
    PRPT1: this.wpss.wps23,
    PRPT2: this.wpss.wps24,
    PRPT3: this.wpss.wps25,
    PRPT4: this.wpss.wps26,
    PRPT5: this.wpss.wps27,
    DEAE1: this.wdss.wds1,
    DEAE2: this.wdss.wds2,
    DEAE3: this.wdss.wds3,
    DECM1: this.wdss.wds4,
    DECM2: this.wdss.wds5,
    DECM3: this.wdss.wds6,
    DECM4: this.wdss.wds7,
    DECM5: this.wdss.wds8,
    DECM6: this.wdss.wds9,
    DECM7: this.wdss.wds10,
    DECM8: this.wdss.wds11,
    DEDP1: this.wdss.wds12,
    DEDP2: this.wdss.wds13,
    DEDP3: this.wdss.wds14,
    DEDP4: this.wdss.wds15,
    DEDP5: this.wdss.wds16,
    DEDP6: this.wdss.wds17,
    RSRP1: this.wrss.wrs1,
    RSCO1: this.wrss.wrs2,
    RSCO2: this.wrss.wrs3,
    RSCO3: this.wrss.wrs4,
    RSCO4: this.wrss.wrs5,
    RSAN1: this.wrss.wrs6,
    RSAN2: this.wrss.wrs7,
    RSAN3: this.wrss.wrs8,
    RSMI1: this.wrss.wrs9,
    RSMI2: this.wrss.wrs10,
    RSIM1: this.wrss.wrs11,
    RSIM2: this.wrss.wrs12,
    RCRP1: this.wress.wres1,
    RCRP2: this.wress.wres2,
    RCRP3: this.wress.wres3,
    RCIM1: this.wress.wres4,
    RCIM2: this.wress.wres5,
    RCCO1: this.wress.wres6,
    RCCO2: this.wress.wres7
  }
  console.log(data);
  let entries= Object.entries(data);
  let sorted = entries.sort((a, b) => a[1] - b[1]);
  console.log(sorted);
  var rec1=sorted[77][0],rec2=sorted[78][0],rec3=sorted[79][0],rec4=sorted[80][0],rec5=sorted[81][0];
  console.log(rec1);
  console.log(rec2);
  console.log(rec3);
  console.log(rec4);
  console.log(rec5);
  for(i=0;i<79;i++){
	console.log(sorted[i][1]);
  }
	if(sorted[77][1]!=0)
	{
	Rec.getRec(rec1, function(err, reco1){
    if (reco1) {
     recom1 = {
            "recomon1": reco1
        }
		console.log(recom1.recomon1._id);
    console.log(recom1.recomon1.rec);
    } else {
      error = {
            "error": "Please check entered ID"
        }
    }
  });
    Rec2.getRec(rec1, function(err, reco2){
      if (reco2) {
       recom2 = {
              "recomon2": reco2
          }
  		console.log(recom2.recomon2._id);
      console.log(recom2.recomon2.rec);
      } else {
        error = {
              "error": "Please check entered ID"
          }
      }
    });
      Rec3.getRec(rec1, function(err, reco3){
        if (reco3) {
         recom3 = {
                "recomon3": reco3
            }
    		console.log(recom3.recomon3._id);
        console.log(recom3.recomon3.rec);
        } else {
          error = {
                "error": "Please check entered ID"
            }
        }
	});
    r1={
		r1:1
	}
	}
	else{
	r1={
		r1:0
	}
	}
	if(sorted[78][1]!=0)
	{
  Rec.getRec(rec2, function(err, reco4){
    if (reco4) {
     recom4 = {
            "recomon4": reco4
        }
		console.log(recom4.recomon4._id);
    console.log(recom4.recomon4.rec);
    } else {
      error = {
            "error": "Please check entered ID"
        }
    }
	});
  Rec2.getRec(rec2, function(err, reco5){
    if (reco5) {
     recom5 = {
            "recomon5": reco5
        }
		console.log(recom5.recomon5._id);
    console.log(recom5.recomon5.rec);
    } else {
      error = {
            "error": "Please check entered ID"
        }
    }
	});
  Rec3.getRec(rec2, function(err, reco6){
    if (reco6) {
     recom6 = {
            "recomon6": reco6
        }
		console.log(recom6.recomon6._id);
    console.log(recom6.recomon6.rec);
    } else {
      error = {
            "error": "Please check entered ID"
        }
    }
	});
    r2={
	  r2:1
	}
	}
	else{
	r2={
	  r2:0
	}
	}
	if(sorted[79][1]!=0)
	{
  Rec.getRec(rec3, function(err, reco7){
    if (reco7) {
      recom7 = {
            "recomon7": reco7
        }
		console.log(recom7.recomon7._id);
    console.log(recom7.recomon7.rec);
    } else {
      error = {
            "error": "Please check entered ID"
        }
    }
	});
  Rec2.getRec(rec3, function(err, reco8){
    if (reco8) {
      recom8 = {
            "recomon8": reco8
        }
		console.log(recom8.recomon8._id);
    console.log(recom8.recomon8.rec);
    } else {
      error = {
            "error": "Please check entered ID"
        }
    }
	});
  Rec3.getRec(rec3, function(err, reco9){
    if (reco9) {
      recom9 = {
            "recomon9": reco9
        }
		console.log(recom9.recomon9._id);
    console.log(recom9.recomon9.rec);
    } else {
      error = {
            "error": "Please check entered ID"
        }
    }
	});
    r3={
	  r3:1
	}
	}
	else{
	r3={
	  r3:0
	}
	}
  if(sorted[80][1]!=0)
	{
  Rec.getRec(rec4, function(err, reco10){
    if (reco10) {
     recom10 = {
            "recomon10": reco10
        }
		console.log(recom10.recomon10._id);
    console.log(recom10.recomon10.rec);
    } else {
      error = {
            "error": "Please check entered ID"
        }
    }
	});
  Rec2.getRec(rec4, function(err, reco11){
    if (reco11) {
     recom11 = {
            "recomon11": reco11
        }
		console.log(recom11.recomon11._id);
    console.log(recom11.recomon11.rec);
    } else {
      error = {
            "error": "Please check entered ID"
        }
    }
	});
  Rec3.getRec(rec4, function(err, reco12){
    if (reco12) {
     recom12 = {
            "recomon12": reco12
        }
		console.log(recom12.recomon12._id);
    console.log(recom12.recomon12.rec);
    } else {
      error = {
            "error": "Please check entered ID"
        }
    }
	});
    r4={
	  r4:1
	}
	}
	else{
	r4={
	  r4:0
	}
	}
  if(sorted[81][1]!=0)
  {
  Rec.getRec(rec5, function(err, reco13){
    if (reco13) {
     recom13 = {
            "recomon13": reco13
        }
		console.log(recom13.recomon13._id);
    console.log(recom13.recomon13.rec);
    } else {
      error = {
            "error": "Please check entered ID"
        }
    }
  });
    Rec2.getRec(rec5, function(err, reco14){
      if (reco14) {
       recom14 = {
              "recomon14": reco14
          }
  		console.log(recom14.recomon14._id);
      console.log(recom14.recomon14.rec);
      } else {
        error = {
              "error": "Please check entered ID"
          }
      }
    });
      Rec3.getRec(rec5, function(err, reco15){
        if (reco15) {
         recom15 = {
                "recomon15": reco15
            }
    		console.log(recom15.recomon15._id);
        console.log(recom15.recomon15.rec);
        } else {
          error = {
                "error": "Please check entered ID"
            }
        }
  });
	r5={
	  r5:1
	}
	}
	else{
	r5={
	  r5:0
	}
	}
});

// Results
router.get('/result', ensureAuthenticated, (req, res) =>
  res.render('Result', {
    user: req.user
  })
);

//sending data to RESULTS
router.get('/show', function(req,res){
  everything = {
    iresponse : this.identifyscore,
    presponse : this.protectscore,
    dresponse : this.detectscore,
    rresponse : this.respondscore,
    reresponse : this.recoverscore,
  }
	console.log(everything);
	res.json(everything);
});

// Recommendations
router.get('/recommendations', ensureAuthenticated, (req, res) =>
  res.render('Recommendations', {
    user: req.user
  })
);

//showing recommendations
router.get('/finalrecommendations', function(req,res){
	var recommendation1=this.r1.r1==1;
	var recommendation2=this.r2.r2==1;
	var recommendation3=this.r3.r3==1;
	var recommendation4=this.r4.r4==1;
	var recommendation5=this.r5.r5==1;
	recommendations={
    rec1 : recommendation1 ? this.recom1.recomon1 : 'no recommendation',
    rec2 : recommendation1 ? this.recom2.recomon2 : 'no recommendation',
    rec3 : recommendation1 ? this.recom3.recomon3 : 'no recommendation',
    rec4 : recommendation2 ? this.recom4.recomon4 : 'no recommendation',
    rec5 : recommendation2 ? this.recom5.recomon5 : 'no recommendation',
    rec6 : recommendation2 ? this.recom6.recomon6 : 'no recommendation',
    rec7 : recommendation3 ? this.recom7.recomon7 : 'no recommendation',
    rec8 : recommendation3 ? this.recom8.recomon8 : 'no recommendation',
    rec9 : recommendation3 ? this.recom9.recomon9 : 'no recommendation',
    rec10 : recommendation4 ? this.recom10.recomon10 : 'no recommendation',
    rec11 : recommendation4 ? this.recom11.recomon11 : 'no recommendation',
    rec12 : recommendation4 ? this.recom12.recomon12 : 'no recommendation',
    rec13 : recommendation5 ? this.recom13.recomon13 : 'no recommendation',
    rec14 : recommendation5 ? this.recom14.recomon14 : 'no recommendation',
    rec15 : recommendation5 ? this.recom15.recomon15 : 'no recommendation'
	}

  if(this.r1.r1==0 && this.r2.r2==0 && this.r3.r3==0 && this.r4.r4==0 && this.r5.r5==0){
	recommendations={
		rec: 'you don\'t have any recommendations'
	}
	}
  res.json(recommendations);
});

module.exports = router;
