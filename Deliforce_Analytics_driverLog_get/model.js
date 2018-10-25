const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const constant = require('./constant')();
const tables = constant.TABLES;

//action=[{code:1,exist:0/1,mandatory:0/1}]
//autoAllocation:{enable:true/false,method:1/2/3,expire:anyNumber,retry:anyNumber}

var driverLogSchema = new Schema({
  clientId: String,
  driverId: {type: Schema.Types.ObjectId, ref: tables.DRIVER},
  assignTeam: {type: Schema.Types.ObjectId, ref: tables.TEAM},
  date: {type: Date},
  idleTime: Number,//idel Time
  activeTime: Number,//active Time
  idleDist: Number,//idle dist
  activeDist: Number //active dist


}, {strite: false});

module.exports = mongoose.model(tables.DRIVER, driverLogSchema);
