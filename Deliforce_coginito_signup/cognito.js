const AWS = require('aws-sdk');
const constant = require('./constant')().AWS;
AWS.config.update({region: constant.region});
const AmazonCognitoIdentity = require('amazon-cognito-identity-js-node');
const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
const CognitoUserAttribute = AmazonCognitoIdentity.CognitoUserAttribute;

module.exports = {
  createUser: function (user) {
    return new Promise((resolve, reject) => {

// Define AWS Cognito User Pool
      const poolData = {
        "UserPoolId": constant['userPoolId'],
        "ClientId": constant['clientId']
      };
      const userPool = new CognitoUserPool(poolData);

// Define User Attributes
      const attributeList = [];
      const dataEmail = {
        "Name": "email",
        "Value": user.email

      };
      const dataName = {
        "Name": 'name',
        "Value": user.name
      };
      const dataRole = {
        "Name": 'custom:role',
        "Value": '1' // because of he is admin
      };
      const dataPhone = {
        "Name": 'phone_number',
        "Value": user.phone.replace(' ', '')
      };

      attributeList.push(new CognitoUserAttribute(dataEmail.Name, dataEmail.Value));
      attributeList.push(new CognitoUserAttribute(dataPhone.Name, dataPhone.Value));
      attributeList.push(new CognitoUserAttribute(dataName.Name, dataName.Value));
      attributeList.push(new CognitoUserAttribute(dataRole.Name, dataRole.Value));

// Create User via AWS Cognito
      userPool.signUp(user.email, user.password, attributeList, null, function (err, result) {
        if (err) {
          reject(err);
        } else {
          console.log('user created' + JSON.stringify(result));
          resolve(result);
        }
      });
    });
  }
};
