const cognito = require('./cognito.js');
const defaults = require('./default');
const constant = require('./constant')();
const settingModel = require('./model').setting;
const preferenceModel = require('./model').preference;
const adminModel = require('./model').admin;
const db = require('./db').connect();
const util = require('./util');
const result = require('./result');
const notify = require('./notify');
const userPlansModel = require('./model').userPlans;
const plansModel = require('./model').plans;
const signupErrorMsgs = require('./error').CODES;

module.exports = {
  signupUser: signupUser
};


function sendError(error, cb) {
  console.error('error +++', error);
  result.sendServerError(cb);
}


function createAdmin(cognitoSub, data) {
  const adminData = Object.assign(data, {cognitoSub: cognitoSub, role: constant.ROLE.ADMIN});
  return new adminModel(adminData).save();
}


function createDefaults(admin) {
  const clientId = admin['cognitoSub'];
  const promises = [];
  const extend = {clientId: clientId};
  //create settings
  const settings = defaults.settings.map((s) => Object.assign(s, extend));
  promises.push(settingModel.insertMany(settings));
  //create preference
  const preference = new preferenceModel(Object.assign(defaults.preference, extend));
  promises.push(preference.save());
  return Promise.all(promises);
}


function defaultUserPlans(cognitoSub) {
  const clientId = cognitoSub;
  return plansModel.findOne({planType: 1}).then((plan) => {
    plan = (plan.agentLimit) ? plan : plan._doc;
    const date = new Date(), y = date.getFullYear(), m = date.getMonth();
    const lastDate = new Date(Date.UTC(y, m + 1, 0)).toISOString();
    const model = {
      clientId: clientId,
      packageType: 1,
      agentLimit: plan.agentLimit,
      taskLimit: plan.taskLimit,
      agentCount: 0,
      taskCount: 0,
      endDate: lastDate
    };
    const userPlan = new userPlansModel(model);
    console.log('userPlan' + userPlan);
    return userPlan.save();
  })
}


// create defaults
function doNeed(cognitoSub, data, cb) {
  createAdmin(cognitoSub, data)
    .then((admin) => {
      console.log('admin created');
      return Promise.all([createDefaults(admin), defaultUserPlans(cognitoSub)]);
    }).then((response) => {
    console.log(JSON.stringify(response));
    result.sendSuccess(cb, {});
  }).catch((err) => {
    sendError(err, cb);
  });
}


function signupUser(event, cb) {
  db.then(() => {
    const data = util.getBodyData(event);
    if (!data) {
      result.invalidInput(cb);
    } else {
      checkDuplicate(data, cb);
    }
  }).catch((err) => {
    sendError(err, cb);
  })
}

function checkDuplicate(data, cb) {
  adminModel.findOne({$or: [{'email': data.email}, {'phone': data.phone}]})
    .then((user) => {
      if (user) {
        if (user.email === data.email) {
          console.log('duplicate key of email');
          result.sendDuplicateEmail(cb);
        } else {
          console.log('duplicate key of phone');
          result.sendDuplicatePhone(cb);
        }
      } else {
        validateUserData(data, cb);
      }
    }).catch((err) => sendError(err, cb));
}


function validateUserData(data, cb) {
  // cognitosub is mock here
  const testData = Object.assign({}, data, {
    cognitoSub: '23232332'
  });

  const userData = new adminModel(testData);

  userData.validate((err) => {
    if (err) {
      handlerError(err, cb);
    } else {
      createCognitoUser(data, cb);
    }
  })
}


function handlerError(error, cb) {
  const err = error.errors;
  if (!err) {
    result.sendServerError(cb);
  } else {
    if (err.email) {
      result.sendEmailInvalid(cb);
    } else if (err.name) {
      result.sendNameInvalid(cb);
    } else if (err.phone) {
      result.sendPhoneInvalid(cb);
    }
    else if (err.password) {
      result.sendPasswordInvalid(cb);
    }
    else {
      console.log(err);
      result.invalidInput(cb);
    }
  }
}


function createCognitoUser(data, cb) {
  cognito.createUser(data)
    .then((cognitoUser) => {
    console.log(cognitoUser,'+++++++++++');
      const cognitoSub = cognitoUser.userSub;
      if (!cognitoSub) {
        console.log('sub not found on cognito');
        result.sendServerError(cb);
      }
      doNeed(cognitoSub, data, cb);
    }).catch((err) => sendCognitoError(err, cb));
}

// function invoke_sns_lambda (data ,cognitoSub) {
//   console.log('coming here');
//   console.log(cognitoSub + 'line number 171');
//   var AWS = require('aws-sdk');
//   var lambda = new AWS.Lambda({
//     region: 'ap-south-1' //change to your region
//   });
//
//   var payload ={} ;
//   payload.clientId = cognitoSub;
//   payload.buisnessType = null ;
//   payload.trigger = "SIGNUP" ;
//
//   payload.dynamicValues =
//     {
//       CustomerName:data.name,
//       // StartDate:Startdate,
//       // StartTime:startTime,
//       // EndDate: endDate,
//       // EndTime  : endTime,
//       // AgentName:"test",
//       // OrderId  : data.orderId,
//       // CustomerAddress :data.address.formatted_address
//     };
//   // payload.number = data.phone;
//   // payload.email = data.email;
//
//   //let payload= {'message':'ramachandra reddy',clientId:'017db723-1a62-4520-a544-a7eebc0b8b30'};
//   var params = {
//     FunctionName: 'SmsAndEmailNotification', // the lambda function we are going to invoke
//     InvocationType: 'Event',
//     LogType: 'Tail',
//     Payload: JSON.stringify(payload),
//
//   };
//
//   return new Promise((reslove,reject)=>{
//
//     lambda.invoke(params, function (err, data) {
//       if (err) {
//         console.log('error in sns',err);
//         reslove();
//
//       } else {
//         console.log('called sns lambda');
//         reslove();
//
//       }
//     })
//   })
//
// };








function sendCognitoError(err, cb) {
  console.log('cognito error', err);
  const cognito = signupErrorMsgs;
  if (err.code === cognito.PASSWORD_INVALID) {
    result.sendPasswordInvalid(cb);
  } else if (err.code === cognito.EMAIL_EXIST) {
    result.sendDuplicateEmail(cb);
  } else if (err.statusCode === 400) {
    console.log('invalid phone or email');
    result.sendInvalidPhoneOrEmail(cb);
  } else {
    result.sendServerError(cb);
  }


  /*function sendCognitoError(err, cb) {
    console.log('cognito error', err);
    const cognito = constant.COGNITO_ERROR;
    if (err.code === cognito.PASSWORD_INVALID) {
      if (err.message === cognito.INVALID_PHONE) {
        console.log('invalid phone or email');
        result.sendInvalidPhoneOrEmail(cb);
      }
      result.sendPasswordInvalid(cb)
    } else if (err.code === cognito.EMAIL_EXIST) {
      result.sendDuplicateEmail(cb);
    } else {
      result.sendServerError(cb);
    }
  }*/

  /*
  const data = ;
  */


}
