let cb;
const result = require('./result');

try {
  const getConstant = require('./constant')();
  // const callback = function (err, data) {
  //   console.log(err,data);
  // };
 // const event = require('../mock').admin.event;
//  event.body = '{"email":"disha@mailinator.com","phone":"+91 900331020","name":"ddffdds","password":"Vkey@123"}';

  exports.handler = (event, context, callback) => {
    console.log(getConstant);

    console.log(JSON.stringify(event));

    cb = callback;
    context.callbackWaitsForEmptyEventLoop = false;
////////// durgaprasad favas//////////////////////////

    getConstant.then(() => {
      //imports
      const admin = require('./admin');
      const helper = require('./util');
      //for trigger
      if (helper.checkFromTrigger(cb, event)) return;
      //init
      admin.signupUser(event, cb);
    }).catch((err) => {
      console.log('abdul',err);
      result.sendServerError(cb)
    });


  };
} catch (err) {
  console.log(err);
  result.sendServerError(cb);
}
