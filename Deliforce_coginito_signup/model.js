const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const constant = require('./constant')();
const role = constant.ROLE;
const isIt = constant.isIt;


const settingSchema = new Schema({
  businessType: {type: Number, required: true},
  isCurrent: {type: Boolean, required: true},
  enableAutoAllocation: {type: Boolean, required: true},
  autoAllocation: Schema.Types.Mixed,
  notifications: Schema.Types.Mixed,
  actionBlock: Schema.Types.Mixed,
  acknowledgementType: Schema.Types.Mixed,
  clientId: {type: String, required: true},
});

const preferenceSchema = new Schema({
  customizeAgentTextAs: Schema.Types.Mixed,
  customizeManagerTextAs: Schema.Types.Mixed,
  dashboardLanguage: Schema.Types.Mixed,
  customerTrackingLanguage: Schema.Types.Mixed,
  distance: Schema.Types.Mixed,
  timeZone: Schema.Types.Mixed,
  clientId: {type: String, required: true},
});

const adminSchema = new Schema({
  name: {type: String, required: true},
  email: {type: String, required: true},//cognito validation
  phone: {type: String, required: true},//cognito validation(+91 32323)
  password: {type: String, required: true},//cognito min 8 char ,alpha(upper,lower) numeric, special character
  resetPasswordToken: {type: String},
  resetPasswordExpires: {type: Date},
  isBlocked: {type: Number, default: 0},
  role: {type: Number, required: true, default: role.ADMIN},//Role constant - 1
  cognitoSub: {type: String, required: true},
  isDeleted: {type: Number, default: isIt.NO},
  companyName: {type: String},
  companyAddress: {type: String},
  country: {type: String},
  image: {type: String},
  created_at: {type: Date, default: Date.now}
});

const userPlanSchema = new Schema({
  clientId: {type: String},
  companyName: {type: String},
  packageType: {type: Number},// free-1 pack-1==2 pack-3
  agentLimit: {type: Number}, //
  taskLimit: {type: Number},
  agentCount: {type: Number, default: 0},
  taskCount: {type: Number, default: 0},
  price: {type: Number, default: 0}, //$10 per agent
  period: {type: Number, default: 1},// 1-month 3-month 6-month
  startDate: {type: Date, default: Date.now()},
  endDate: {type: Date},
  credits: {type: Number, default: 0},
  discount: {type: Number, default: 0},
  tax: {type: Number, default: 0},
  // cardDetails:Schema.Types.Mixed, //cardNumber,expiry (mm/yy),cvv(3 digits),isCurrent:boolean, card holder name
  currency: {type: String, default: 'USD'},

  coupenNumber: {type: String},
  // hasPaid: {type: Boolean, default: 1}
});

delete  mongoose.connection.models['userplans'];
const plansSchema = new Schema({});

const plansModel = mongoose.model('plans', plansSchema);
const userPlansModel = mongoose.model('userplans', userPlanSchema)
const settingModel = mongoose.model('setting', settingSchema);
const preferenceModel = mongoose.model('preference', preferenceSchema);
const adminModel = mongoose.model('user', adminSchema);

module.exports = {
  setting: settingModel, preference: preferenceModel, admin: adminModel,
  userPlans: userPlansModel, plans: plansModel
};






