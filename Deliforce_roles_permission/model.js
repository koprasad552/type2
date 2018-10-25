const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//roles - admin:1 ,manger:2 ,driver:3
//principalType - role -1 , userid - 2

//user1 - {_id:1221,name:'abdul', role:2 , email:'',userSub:1234}
//user2 - {_id:1224,name:'kruthika', role:2 , email:'',userSub:3214}

//example allow role to list task
//{principalType:1,principalId:2,moduleAction:'TASK.READ',grant:true}
//{principalType:1,principalId:2,moduleAction:'ACTIONS.MULTIPLECHANGESTATUS.UPDATE',grant:true}

//example allow userId to list task
//{principalType:2,principalId:'1234',moduleAction:'TASK.DELETE',grant:true}

const permissionSchema = new Schema({
  principalType: {type: Number},
  principalId: {type: String},
  moduleAction: {type: String},
  grant: {type: Boolean}
}, {strite: false});

const userSchema = new Schema({});

const userModel = mongoose.model('user', userSchema);
const permssionModel = mongoose.model('permission', permissionSchema);

module.exports = {user: userModel, permission: permssionModel};
