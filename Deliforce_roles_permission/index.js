// const context = {
//   succeed: function (data) {
//     console.log(JSON.stringify(data));
//   },
//   fail: function (data) {
//     console.log('fail +' + JSON.stringify(data));
//   }
// };
//const event = require('./mock').manager.event;
try {

  const getConstant = require('./constant')();

  exports.handler = (event, context) => {

    context.callbackWaitsForEmptyEventLoop = false;
    console.log(event);


    getConstant.then(() => {
      const auth = require('./authorizer');
      const grant = require('./privilage');
      const constant = require('./constant')();
      const permissionC = require('./permission');
      const authConst = permissionC.AUTHORIZE;
      //authenticate then authorize;
      auth.getPrincipal(event)
        .then(authorize)
        .catch(sendError);

      function sendError(error) {
        console.log('failed ', error);
        if (error.name === 'TokenExpiredError') {
          //context.error = {messageString: error.name};
          //TODO have to send proper error for token expired
          context.fail("Unauthorized");
        } else {
          context.fail("Unauthorized");
        }

        //callback(null,error);
      }

      function authorize(principal) {
        console.log('function authorize ++', principal);
        const userSub = principal.sub;
        if (!userSub) {
          context.fail("Unauthorized");
        } else {
          grant.fetchPrivilage(event, userSub)
            .then((data) => {
              const policy = auth.createPolicy(event, principal, authConst.ALLOW, data.resources);
              console.log(JSON.stringify(policy));
              context.succeed(addUserInfoWithPricipal(policy, data.user));
            }).catch((err) => {
             console.log('comes to catch ' + JSON.stringify(err));
             console.log('ERROR ' + err.status);

            if(err.status == 510) {
              console.log('DB Connection error ',err);
              context.fail({status: 510, message: "server went down, please try after sometime"});
            } else {
              console.log('Not DB Connection error');
              const policy = auth.createPolicy(event, principal, authConst.DENY);
              console.log(JSON.stringify(policy));
              context.succeed(policy);
            }

             //const policy = auth.createPolicy(event, principal, authConst.DENY);
            // console.log(JSON.stringify(policy));
            // context.succeed(policy);
           // context.fail({status: 500, message: "server side error"});
           // result.sendServerError(cb)
          });
        }
      }

      //TODO once aws supports send custom data remove this
      function addUserInfoWithPricipal(policy, user) {
        const obj = {
          sub: policy['principalId'],
          role: user['role'],
          clientId: user['clientId'],
          teams: user['teams'],
          _id: user['_id']
        };
        policy['principalId'] = JSON.stringify(obj);
        console.log(JSON.stringify(policy));
        return policy;
      }

    }).catch((err) => {
      console.log(err);
      result.sendServerError(cb)
    });

 };

} catch (err) {
  console.error('error try catch+++', err);
  context.fail("Unauthorized");
}

// zip -r authorizer *
