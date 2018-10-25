const common = require('./error').CODES;
const admin = require('./error').ADMIN_CODES;

module.exports = {

  sendServerError: (cb) => {
    cb(null, formResponse(common.SERVER_ERROR, {}));
  },

  sendSuccess: (cb, body) => {
    cb(null, formResponse(common.SUCCESS, body));
  },

  businessMissing: (cb) => {
    cb(null, formResponse(common.BUSINESS_TYPE_REQUIRED, {}));
  },

  sendResult: (statusCode, body, cb) => {
    cb(null, statusCode, body);
  },

  sendUnAuth: (cb) => {
    cb(null, formResponse(common.AUTH, ''));
  },

  sendInvalidPhoneOrEmail: (cb) => {
    cb(null, formResponse(admin.INVALID_PHONE_OR_EMAIL), '');
  },

  fromTrigger: (cb) => {
    console.log('fromTrigger');
    cb(null, formResponse(400, ''));
  },

  invalidInput: (cb) => {
    cb(null, formResponse(common.BAD_REQUEST, ''));
  },

  //admin

  sendEmailInvalid: (cb) => {
    cb(null, formResponse(common.EMAIL_INVALID, ''));
  },

  sendNameInvalid: (cb) => {
    cb(null, formResponse(common.NAME_INVALID, ''));
  },

  sendPhoneInvalid: (cb) => {
    cb(null, formResponse(common.PHONE_INVALID, ''));
  },

  sendPasswordInvalid: (cb) => {
    cb(null, formResponse(common.PASSWORD_INVALID, ''));
  },


  sendDuplicateEmail: (cb) => {
    cb(null, formResponse(admin.DUPLICTE_EMAIL, ''));
  },

  sendDuplicatePhone: (cb) => {
    cb(null, formResponse(admin.DUPLICATE_PHONE, ''));
  }

};

function formResponse(code, body) {
  const response = {headers: {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*'}};
  const result = (typeof body === 'object') ? JSON.stringify(body) : body;
  return Object.assign(response, {statusCode: code, body: result});
}
