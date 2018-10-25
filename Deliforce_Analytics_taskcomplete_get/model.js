var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var taskSchema = new Schema({
  //customerName:{type:Schema.Types.ObjectId,ref:'customer'},
  name: {type: String},
  phone: {type: String},
  email: {type: String},
  userId: {type: String},

  deliveryType: {type: String},
  pickUpAddress: Schema.Types.Mixed,
  pickUpBefore: {type: Number},
  description: {type: String},
  driver: {type: Schema.Types.ObjectId, ref: 'user'},
  team: {type: String},
  transportType: {type: String},
  orderId: {type: String},
  taskStatus: {type: String},
  taskType: {type: String},//pickup or delivery
  created_at: {type: Date, default: Date.now},
  date: {type: Date},
  startDate: {type: Date},
  endDate: {type: Date},
  category: {type: Number},
  //date:{type:Date},
  time: {type: String},
  images: Schema.Types.Mixed,
  settings: Schema.Types.Mixed,
  priority: {type: Number},
  delayStatus: {type: Number, default: 0},
  delayTime: {type: Number, default: 0}


}, {strite: false});


var userSchema = new Schema({

  name: {type: String, required: true},
  email: {type: String, required: true},
  phone: {type: String, required: true},
  password: {type: String, required: true},
  role: {type: Number, required: true},
  //cilentId:{type:String},
  //Admin only
  companyName: {type: String},
  companyAddress: {type: String},
  country: {},
  //managers:[{type:Schema.Types.ObjectId,ref:'user'}],

  userId: {type: String},

  //Driver onlys:
  currentLocation: Schema.Types.Mixed,
  lastName: String,
  assignTeam: {type: Schema.Types.ObjectId, ref: 'team'},
  notes: String,

  image: {type: String},
  teamId: {type: String},
  tags: {type: String},
  transportType: {type: Number},
  transportDesc: {type: String},
  status: {type: String},
  licencePlate: {type: String},
  kolor: {type: String},
  color: {type: String},
  //Manager only

  teams: Schema.Types.Mixed,
  permissions: Schema.Types.Mixed,
  created_at: {type: Date, default: Date.now},
  apiKey: {type: String}


}, {strite: false});


//userSchema.index({name: "text", email: "text", phone: "text"});


TaskModel = mongoose.model('task', taskSchema);
UserModel = mongoose.model('user', userSchema);
module.exports = {USER: UserModel, TASK: TaskModel}




