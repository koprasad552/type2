let cb;
const result = require('./result');
/*const callback = function (err, data) {
  console.log('callback called+++++++++++++++++++++++++++++++++');
  console.log(err, data);
};*/

try {

  const getConstant = require('./constant')();

 // const event = require('../../mock').manager.event;
  //event.queryStringParameters = require('../../mock').data.reportsTaskComplte;
 exports.handler = (event, context, callback) => {


    context.callbackWaitsForEmptyEventLoop = false;
    cb = callback;
    getConstant.then(() => {
      //imports
      const db = require('./db').connect();
      const topAgent = require('./topAgent');
      const helper = require('./util');

      if (helper.checkFromTrigger(cb, event)) return;


      const principals = helper.getPrincipals(cb, event);
      if (!principals) return;
      console.log(JSON.stringify(principals));


      //connect to db
      db.then(() => topAgent.getTopAgent(event, cb, principals)).catch(sendError);

      function sendError(error) {
        console.error('error +++', error);
        result.sendServerError(cb);
      }

    }).catch((err) => {
      console.log(err);
      result.sendServerError(cb);
    });

  };
} catch (err) {
  console.error('error +++', err);
  result.sendServerError(cb);
}


// const data = {
//   "filter": {
//     "teamFilter": "",
//     "driverFilter": "",
//     "dateFilter": ["2018-01-15T06:10:07.828Z", "2018-03-17T06:10:07.828Z"],
//     "categoryFilter": ""
//   }
// }


// top_agent.zip
