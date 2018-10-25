const result = require('./result');
const customerModel = require('./model');
const helper = require('./util');
const constant = require('./constant')();
const isIt = constant.isIt;

module.exports = {
  fetchCustomer:(event, cb, principals)=> {
    const clientId = (helper.isAdmin(principals)) ? principals['sub'] : null;
    if(!clientId){
      result.sendUnAuth(cb);
    }else {
      const data = helper.getQueryData(event);
      if(!data){
        result.invalidInput(cb);
      }
      const query = {clientId: clientId, isDeleted: isIt.NO};
      if (data.filter && data.filter.search) {
        query.name = {$regex: `.*${data.filter.search}.*`, '$options': 'i'};
      }
      customerModel.paginate(query, {
        page: data.page || 1,
        limit: data.limit || 10,
        sort: {'created_at': -1}
      }, function (err, customers) {
        console.log(err, customers);
        if (err) {
          console.log(err);
          result.sendServerError(cb);
        } else {
          console.log(customers);
          result.sendSuccess(cb, customers);
        }
      });
    }
  }
};







