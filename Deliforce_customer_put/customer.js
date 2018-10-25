const result = require('./result');
const customerModel = require('./model');
const helper = require('./util');

module.exports = {
  editCustomer:(event, cb, principals)=> {
    const clientId = (helper.isAdmin(principals)) ? principals['sub'] : null;
    if(!clientId){
      result.sendUnAuth(cb);
    }
    const data = helper.getBodyData(event);
    if(!data){
      result.invalidInput(cb);
    }
    const id = data._id;
    delete data._id;
    customerModel.update({_id: id, clientId: clientId}, data).then((data) => {
      result.sendSuccess(cb, data);
    }).catch((error, cb) => {
      handlerError(error, cb)
    });
  }
};

function handlerError(error, cb) {
  const err = error.errors;
  if (err.name) {
    result.invalidName(cb);
  }
  else if (err.phone) {
    result.invalidPhone(cb);
  }
  else if (err.email) {
    result.invalidEmail(cb);
  }
  else if (err.address) {
    result.invalidAddress(cb);
  }
  else {
    result.sendServerError(cb);
  }
}





