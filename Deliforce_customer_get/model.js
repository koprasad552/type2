const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');
const constant = require('./constant')();
const tables = constant.TABLES;
const isIt = constant.isIt;


const customerSchema = new Schema({
  name: {type: String, required: true},
  phone: {type: String, required: true},
  email: {type: String},
  address: {type: Schema.Types.Mixed, required: true},
  color:{type:String},
  //from logic
  clientId: {type: String, required: true},
  isDeleted: {type: Number, default: isIt.NO},
  created_at: {type: Date, default: Date.now},
});


customerSchema.plugin(mongoosePaginate);
module.exports = mongoose.model(tables.CUSTOMER, customerSchema);







