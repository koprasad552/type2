module.exports = {
  //common
  CODES: {
    SERVER_ERROR: 500,
    AUTH: 403,
    BAD_REQUEST: 400,  // no body or query string if it is mandatory

    //fields
    EMAIL_INVALID: 406,
    PHONE_INVALID: 407,
    PASSWORD_INVALID: 408,
    NAME_INVALID: 409,
    INVALID_INPUT: 405,  // maximum dont use it
    BUSINESS_TYPE_REQUIRED: 412,
    INVALID_PHONE_OR_EMAIL: 425,
    SUCCESS: 200,
    //TRANSACTION
    TRANSACTION_FAILURE: 501 // backend loggig
  },

  //task
  TASK_CODES: {
    //fields
    ADDRESS_INVALID: 410,
    DATE_REQUIRED: 411,
    END_DATE_LESSER_START: 413,
    START_LESSER_THAN_CURRENT: 414,

  },


  //driver
  DRIVER_CODES: {
    TEAM_MANDATORY: 415,
    DUPLICATE_DRIVER_NAME_AND_EMAIL: 420
  },


  //manager
  MANAGER_CODES: {
    TEAM_MANDATORY: 416,
    DUPLICTE_EMAIL: 421,
    DUPLICATE_PHONE: 422,
    INVALID_PHONE_OR_EMAIL: 425
  },

  //team
  TEAM_CODES: {
    DUPLICATE_TEAM_NAME: 417,
    INVALID_TEAMNAME: 418,

    //delete
    TEAM_HAS_DRIVER: 419
  },

  //admin
  ADMIN_CODES: {
    DUPLICTE_EMAIL: 423,
    DUPLICATE_PHONE: 424,
    INVALID_PHONE_OR_EMAIL: 426
  },


  //settings
  SETTING_CODES: {}



  //customer


  //tasklog


  //preference


};
