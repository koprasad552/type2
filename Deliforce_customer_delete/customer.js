const result = require('./result');
const customerModel = require('./model');
const helper = require('./util');
const constant = require('./constant')();
const isIt = constant.isIt;


module.exports = {
  deleteCustomer:(event, cb, principals)=> {
    const clientId = (helper.isAdmin(principals)) ? principals['sub'] : null;
    if (!clientId) {
      result.sendUnAuth(cb);
    } else {
      const data = helper.getQueryData(event);
      if(!data){
        result.invalidInput(cb);
      }
      customerModel.update({_id: data._id, clientId: clientId}, {isDeleted:isIt.YES}).then((data) => {
        result.sendSuccess(cb, data);
      }).catch((err) => {
        result.sendServerError(cb);
      });
    }
  }
};






