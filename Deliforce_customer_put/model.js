const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const constant = require('./constant')();
const tables = constant.TABLES;
const isIt = constant.isIt;
const validator = require('./validator');


const customerSchema = new Schema({
  name: {type: String, required: true},
  phone: {type: String, required: true, validate: validator.phoneValidateEmpty},
  email: {type: String, validate: validator.emailValidator},
  address: {type: Schema.Types.Mixed, required: true},
  //from logic
  clientId: {type: String, required: true},
  isDeleted: {type: Number, default: isIt.NO},
  created_at: {type: Date, default: Date.now},
});

module.exports = mongoose.model(tables.CUSTOMER, customerSchema);

