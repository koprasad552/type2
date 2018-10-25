// not called in current code
var AWS = require('aws-sdk');
AWS.config.region = 'eu-west-1';
var lambda = new AWS.Lambda();

module.exports.call = function (payload) {
  var params = {
    FunctionName: 'email', // the lambda function we are going to invoke
    InvocationType: 'Event',
    LogType: 'Tail',
    Payload: JSON.stringify(Object.assign({}, payload, {context: 'SIGNUP'})) // PAYMENT
   /* Payload: JSON.stringify(payload),
    ClientContext: 'SIGNUP'*/
  };

  lambda.invoke(params, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      console.log('Lambda said ' + data.Payload);
    }
  })
};
