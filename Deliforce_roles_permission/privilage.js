const dbConnection = require('./db').connect();
const permissionModel = require('./model').permission;
const userModel = require('./model').user;
const constant = require('./constant')();
const permissionC = require('./permission');

module.exports = {

  fetchPrivilage: function (event, sub) {
    return dbConnection.then(() => {
      const moduleAction = getmoduleAction(event);
      return findUser(sub).then((user) => {
        const isAdmin = user.role === constant.ROLE.ADMIN;
        if (!user) {
          console.log('user not found for sub');
          return Promise.reject();
        } else if (!isAdmin && !moduleAction) {
          console.log('moduleAction not found for API in constant' + event.path);
          return Promise.reject();
        } else {
          console.log('User++', user);
          //return checkPermission(moduleAction, user.toObject());
          return formPermissionURL(user.toObject());
        }
      });
    }).catch((err) => {
      console.log('db connection error',err);
     // console.log(JSON.stringify(err));
     // console.log(err.name);

     // if(err.name === 'MongoError') {
      return Promise.reject({'status':'510','message':'server went down, please try after sometime'})

      // } else {
      //   context.fail("server down");
      // }

    });
  }
};


function findUser(sub) {
  return userModel.findOne({cognitoSub: sub})
}

function getmoduleAction(event) {
  const path = event.path;  //    task
  const method = event.httpMethod;  // get
  if (path && method) {
    const pathConst = path.substr(1).replace('/', '_') + '_' + method;
    console.log('moduleAction+++', pathConst.toUpperCase());
    return permissionC.API_PRIVILAGE[pathConst.toUpperCase()];  //TASK_GET : TASK.READ
  }
}



function formPermissionURL(user) {

  const userId = user['cognitoSub'];
  const roleId = user['role'];
  if (user.role === constant.ROLE.ADMIN) {
    const resources = [{resource: '*', method: '*'}];
    return Promise.resolve({user: user, resources: resources});
  } else if (user.role === constant.ROLE.MANAGER) {
    console.log(userId, roleId);
    //permissionModel.find({}).then((d)=>console.log(d));
    return permissionModel.find({principalId: {$in: [userId, roleId]}})
      .then((permissions) => {
        //console.log(permissions);

        const resources = [];
        permissions.forEach((per) => {
          const action = per.moduleAction;
          const splits = action.split('.');
          const method = permissionC.METHOD_MAP[splits.pop()] || 'GET';
          const resource = splits.join('/').toLowerCase();
          resources.push({resource: resource, method: method});
        });
        console.log(JSON.stringify(resources));
        //return checkAccess(permissions);
        return Promise.resolve({user: user, resources: resources});
      });
  } else {
    return Promise.reject('don\'t have access for this user role');
  }
}


/*function checkPermission(moduleAction, user) {
  // to save db opt time allow all for admin. If admin is not accessible to all resource remove this.
  const userId = user['_id'];
  const roleId = user['role'];
  if (user.role === constant.ROLE.ADMIN) {
    return Promise.resolve(user);
  } else {
    console.log(userId, roleId);
    //permissionModel.find({}).then((d)=>console.log(d));
    return permissionModel.find({moduleAction: moduleAction, principalId: {$in: [userId, roleId]}})
      .then((permissions) => {
        console.log(permissions.length, '+++');
        return checkAccess(permissions);
      });
  }

  function checkAccess(permissons) {
    const roleC = constant.PRINCIPAL;
    if (!permissons.length) {
      console.log('no access found in db');
      return Promise.reject();
    } else {
      return Promise.resolve(user);
      // TODO currently we are not adding deny rule so no need to check for this
      /!*permissons.forEach((perm)=>{
		if(perm.principalType===roleC.USER){

		}else if(perm.principalType===roleC.ROLE) {

		}
	  });*!/
    }
  }

}*/
