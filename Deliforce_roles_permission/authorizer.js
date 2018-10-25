console.log('Loading function');

var jwt = require('jsonwebtoken');
var request = require('request');
var jwkToPem = require('jwk-to-pem');
var _= require('lodash');
var constant = require('./constant')();
var permissionC = require('./permission');
var userPoolId = constant.AWS.userPoolId;
var region = constant.COGNITO.REGION; //e.g. us-east-1
var iss = 'https://cognito-idp.' + region + '.amazonaws.com/'+userPoolId;
//var jwks = require('./jwks.json');
// var pems = {
//
// };

var pems= { 'i61YmcgZsd+YvPt7xr9y1tCteq8nkG9/hZhSfWsZnhg=': '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAl4OetUJwa/O5OTDugpFU\nn7LhhUibb+fOTPbDQBaHKkQOLMndnv4/bWG/GPXmBAiv+/qrWtdEKq4ngtObnDiT\nTf2fYENG3o+nKANEzrT8iVHAGxkFepg//Tt6K/VKskWNZmtmFpA86QsKsaTzHpVl\nTTlKBaQYyD9UwmQooObWxJ9p/XLdOQkfBWEA1F3eZ3T18e2qg6urfqNgMIepty8l\nnO1o7GtwkndCMDPEsQCwu3bkJw++Qvb/GQKxetdQ4onj2vLeuf5wW6tZ654nRyhb\n+okbWPQor+JlIU4k0yLG8vVIhyteyrPTt7guXK9MyRLY85FkEQZeZoHH3jMG8Qo5\nxwIDAQAB\n-----END PUBLIC KEY-----\n',
'mUGzKD4MQ0m29QS9UvDnfQNzBXQNcOOr9ilCWdpEQ4Q=': '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvUaoUfdKzxje9u3dLdi2\n4cErFsS01UEj2IzG7CkIWT4twBvOx8j0omltsh56xhbY8yGDVxM2CLsbVDn2fLKh\ndtQoL4wEIHDEsopFoPPHWfH/edFTeP+DKOOLtM2XQj7U6bKuf22h5CewvOGVGfV6\nERveTVKufi0kKzpjmkc/r5o6YrZX2tOJKxP49YJ7SjT/GqnL6aHhmy7HgbbSma0A\nHyxBDBwAhAx6NE/ewNAEhLtCj3QjToyzN25BngEdOPe+vedd0RFzsEGINIs4ACjs\nbGJR4qhTMbMJ+ijncEuWtO4c5BZuKBt+sDSpljuwop54DsdheKiJQHoJ2lm34/vC\nNQIDAQAB\n-----END PUBLIC KEY-----\n'
}

module.exports.getPrincipal = function (event) {


  return new Promise((resolve, reject) => {

    /**
     * A set of existing HTTP verbs supported by API Gateway. This property is here
     * only to avoid spelling mistakes in the policy.
     *
     * @property HttpVerb
     * @type {Object}
     */


    if (_.isEmpty(pems)) {
      //Download the JWKs and save it as PEM
      console.log('called request');
      request({
        url: iss + '/.well-known/jwks.json',
        json: true
      }, function (error, response, body) {
        console.log('got jwks ', error);
        if (!error && response.statusCode === 200) {
          var pems = {};
          var keys = body['keys'];
          for (var i = 0; i < keys.length; i++) {
            //Convert each key to PEM
            var key_id = keys[i].kid;
            var modulus = keys[i].n;
            var exponent = keys[i].e;
            var key_type = keys[i].kty;
            var jwk = {kty: key_type, n: modulus, e: exponent};
            var pem = jwkToPem(jwk);
            pems[key_id] = pem;
          }
        console.log('pems',pems);
          //Now continue with validating the token
          ValidateToken(pems, event);
        } else {
          //Unable to download JWKs, fail the call
          reject({message: error});
        }
      });
    } else {
      ValidateToken(pems, event);
    }


    function ValidateToken(pems, event) {
      var token = event.headers.Authorization;

      if (!token) {
        reject({
          "name": "TokenNotFound",
          "message": "access token not found"
        });
        return
      }
      //Fail if the token is not jwt
      var decodedJwt = jwt.decode(token, {complete: true});
      if (!decodedJwt) {
        reject({
          "name": "InvalidToken",
          "message": "Not a valid JWT token"
        });
        return;
      }

      //Fail if token is not from your UserPool
      if (decodedJwt.payload.iss != iss) {
        reject({
          "name": "InvalidIssuer",
          "message": "token not from this issuer"
        });
        return;
      }

      //Reject the jwt if it's not an 'Access Token'
      if (decodedJwt.payload.token_use != 'access') {
        reject({
          "name": "InvalidTokenType",
          "message": "it's not an 'Access Token'"
        });
        return;
      }

      //Get the kid from the token and retrieve corresponding PEM
      var kid = decodedJwt.header.kid;
      var pem = pems[kid];
      if (!pem) {
        console.log('pem not matching++++++');
        reject({
          "name": "InvalidToken",
          "message": "token invalid"
        });
        return;
      }

      //Verify the signature of the JWT token to ensure it's really coming from your User Pool

      jwt.verify(token, pem, {issuer: iss}, function (err, payload) {
        if (err) {
          reject(err);
        } else {
          resolve(payload);
        }
      });
    }

  });
};

module.exports.createPolicy = function (event, payload, access, resources) {
  //Valid token. Generate the API Gateway policy for the user
  //Always generate the policy on value of 'sub' claim and not for 'username' because username is reassignable
  //sub is UUID for a user which is never reassigned to another user.
  var principalId = payload.sub;

  console.log('user sub ++' + payload.sub);

  //Get AWS AccountId and API Options
  var apiOptions = {};
  var tmp = event.methodArn.split(':');
  var apiGatewayArnTmp = tmp[5].split('/');
  var awsAccountId = tmp[4];
  apiOptions.region = tmp[3];
  apiOptions.restApiId = apiGatewayArnTmp[0];
  apiOptions.stage = apiGatewayArnTmp[1];
  var method = apiGatewayArnTmp[2];
  var resource = addArns(apiGatewayArnTmp, 3);

  function addArns(arr, index) {
    let result = '/';
    for (let i = index; i < arr.length; i++) {
      if (i === index) {
        result += arr[i];
      } else {
        result += '/' + arr[i];
      }
    }
    return result;
  }

  //For more information on specifics of generating policy, refer to blueprint for API Gateway's Custom authorizer in Lambda console
  extendAuthPolicy();
  var policy = new AuthPolicy(principalId, awsAccountId, apiOptions);
  if (access === permissionC.AUTHORIZE.ALLOW) {
    //allow only specific method
    if (resources) {
      //form custom resources
      formCustomResources(resources);
    } else {
      policy.allowMethod(method, resource);
    }

    return policy.build();
  } else {
    //policy.denyAllMethods();
    //deny only specific method
    policy.denyMethod(method, resource);
    return policy.build();
  }


  //form custom plicies for all custom resources in will helps in cache
  function formCustomResources(resources, access) {
    resources.forEach((res) => {
      policy.allowMethod(res.method, res.resource);
    })
  }


  /**
   * AuthPolicy receives a set of allowed and denied methods and generates a valid
   * AWS policy for the API Gateway authorizer. The constructor receives the calling
   * user principal, the AWS account ID of the API owner, and an apiOptions object.
   * The apiOptions can contain an API Gateway RestApi Id, a region for the RestApi, and a
   * stage that calls should be allowed/denied for. For example
   * {
 *   restApiId: "xxxxxxxxxx",
 *   region: "us-east-1",
 *   stage: "dev"
 * }
   *
   * var testPolicy = new AuthPolicy("[principal user identifier]", "[AWS account id]", apiOptions);
   * testPolicy.allowMethod(AuthPolicy.HttpVerb.GET, "/users/username");
   * testPolicy.denyMethod(AuthPolicy.HttpVerb.POST, "/pets");
   * context.succeed(testPolicy.build());
   *
   * @class AuthPolicy
   * @constructor
   */
  function AuthPolicy(principal, awsAccountId, apiOptions) {
    /**
     * The AWS account id the policy will be generated for. This is used to create
     * the method ARNs.
     *
     * @property awsAccountId
     * @type {String}
     */
    this.awsAccountId = awsAccountId;

    /**
     * The principal used for the policy, this should be a unique identifier for
     * the end user.
     *
     * @property principalId
     * @type {String}
     */
    this.principalId = principal;

    /**
     * The policy version used for the evaluation. This should always be "2012-10-17"
     *
     * @property version
     * @type {String}
     * @default "2012-10-17"
     */
    this.version = "2012-10-17";

    /**
     * The regular expression used to validate resource paths for the policy
     *
     * @property pathRegex
     * @type {RegExp}
     * @default '^\/[/.a-zA-Z0-9-\*]+$'
     */
    this.pathRegex = new RegExp('^[/.a-zA-Z0-9-\*]+$');

    // these are the internal lists of allowed and denied methods. These are lists
    // of objects and each object has 2 properties: A resource ARN and a nullable
    // conditions statement.
    // the build method processes these lists and generates the approriate
    // statements for the final policy
    this.allowMethods = [];
    this.denyMethods = [];

    if (!apiOptions || !apiOptions.restApiId) {
      this.restApiId = "*";
    } else {
      this.restApiId = apiOptions.restApiId;
    }
    if (!apiOptions || !apiOptions.region) {
      this.region = "*";
    } else {
      this.region = apiOptions.region;
    }
    if (!apiOptions || !apiOptions.stage) {
      this.stage = "*";
    } else {
      this.stage = apiOptions.stage;
    }

  }

  function extendAuthPolicy() {

    AuthPolicy.HttpVerb = {
      GET: "GET",
      POST: "POST",
      PUT: "PUT",
      PATCH: "PATCH",
      HEAD: "HEAD",
      DELETE: "DELETE",
      OPTIONS: "OPTIONS",
      ALL: "*"
    };

    AuthPolicy.prototype = (() => {
      /**
       * Adds a method to the internal lists of allowed or denied methods. Each object in
       * the internal list contains a resource ARN and a condition statement. The condition
       * statement can be null.
       *
       * @method addMethod
       * @param {String} The effect for the policy. This can only be "Allow" or "Deny".
       * @param {String} he HTTP verb for the method, this should ideally come from the
       *                 AuthPolicy.HttpVerb object to avoid spelling mistakes
       * @param {String} The resource path. For example "/pets"
       * @param {Object} The conditions object in the format specified by the AWS docs.
       * @return {void}
       */
      var addMethod = function (effect, verb, resource, conditions) {
        if (verb != "*" && !AuthPolicy.HttpVerb.hasOwnProperty(verb)) {
          throw new Error("Invalid HTTP verb " + verb + ". Allowed verbs in AuthPolicy.HttpVerb");
        }

        if (!this.pathRegex.test(resource)) {
          throw new Error("Invalid resource path: " + resource + ". Path should match " + this.pathRegex);
        }

        var cleanedResource = resource;
        if (resource.substring(0, 1) == "/") {
          cleanedResource = resource.substring(1, resource.length);
        }

        var resourceArn = "arn:aws:execute-api:" +
          this.region + ":" +
          this.awsAccountId + ":" +
          this.restApiId + "/" +
          this.stage + "/" +
          verb + "/" +
          cleanedResource;

        if (effect.toLowerCase() == "allow") {
          this.allowMethods.push({
            resourceArn: resourceArn,
            conditions: conditions
          });
        } else if (effect.toLowerCase() == "deny") {
          this.denyMethods.push({
            resourceArn: resourceArn,
            conditions: conditions
          })
        }
      };

      /**
       * Returns an empty statement object prepopulated with the correct action and the
       * desired effect.
       *
       * @method getEmptyStatement
       * @param {String} The effect of the statement, this can be "Allow" or "Deny"
       * @return {Object} An empty statement object with the Action, Effect, and Resource
       *                  properties prepopulated.
       */
      var getEmptyStatement = function (effect) {
        effect = effect.substring(0, 1).toUpperCase() + effect.substring(1, effect.length).toLowerCase();
        var statement = {};
        statement.Action = "execute-api:Invoke";
        statement.Effect = effect;
        statement.Resource = [];

        return statement;
      };

      /**
       * This function loops over an array of objects containing a resourceArn and
       * conditions statement and generates the array of statements for the policy.
       *
       * @method getStatementsForEffect
       * @param {String} The desired effect. This can be "Allow" or "Deny"
       * @param {Array} An array of method objects containing the ARN of the resource
       *                and the conditions for the policy
       * @return {Array} an array of formatted statements for the policy.
       */
      var getStatementsForEffect = function (effect, methods) {
        var statements = [];

        if (methods.length > 0) {
          var statement = getEmptyStatement(effect);

          for (var i = 0; i < methods.length; i++) {
            var curMethod = methods[i];
            if (curMethod.conditions === null || curMethod.conditions.length === 0) {
              statement.Resource.push(curMethod.resourceArn);
            } else {
              var conditionalStatement = getEmptyStatement(effect);
              conditionalStatement.Resource.push(curMethod.resourceArn);
              conditionalStatement.Condition = curMethod.conditions;
              statements.push(conditionalStatement);
            }
          }

          if (statement.Resource !== null && statement.Resource.length > 0) {
            statements.push(statement);
          }
        }

        return statements;
      };

      return {
        constructor: AuthPolicy,

        /**
         * Adds an allow "*" statement to the policy.
         *
         * @method allowAllMethods
         */
        allowAllMethods: function () {
          addMethod.call(this, "allow", "*", "*", null);
        },

        /**
         * Adds a deny "*" statement to the policy.
         *
         * @method denyAllMethods
         */
        denyAllMethods: function () {
          addMethod.call(this, "deny", "*", "*", null);
        },

        /**
         * Adds an API Gateway method (Http verb + Resource path) to the list of allowed
         * methods for the policy
         *
         * @method allowMethod
         * @param {String} The HTTP verb for the method, this should ideally come from the
         *                 AuthPolicy.HttpVerb object to avoid spelling mistakes
         * @param {string} The resource path. For example "/pets"
         * @return {void}
         */
        allowMethod: function (verb, resource) {
          addMethod.call(this, "allow", verb, resource, null);
        },

        /**
         * Adds an API Gateway method (Http verb + Resource path) to the list of denied
         * methods for the policy
         *
         * @method denyMethod
         * @param {String} The HTTP verb for the method, this should ideally come from the
         *                 AuthPolicy.HttpVerb object to avoid spelling mistakes
         * @param {string} The resource path. For example "/pets"
         * @return {void}
         */
        denyMethod: function (verb, resource) {
          addMethod.call(this, "deny", verb, resource, null);
        },

        /**
         * Adds an API Gateway method (Http verb + Resource path) to the list of allowed
         * methods and includes a condition for the policy statement. More on AWS policy
         * conditions here: http://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements.html#Condition
         *
         * @method allowMethodWithConditions
         * @param {String} The HTTP verb for the method, this should ideally come from the
         *                 AuthPolicy.HttpVerb object to avoid spelling mistakes
         * @param {string} The resource path. For example "/pets"
         * @param {Object} The conditions object in the format specified by the AWS docs
         * @return {void}
         */
        allowMethodWithConditions: function (verb, resource, conditions) {
          addMethod.call(this, "allow", verb, resource, conditions);
        },

        /**
         * Adds an API Gateway method (Http verb + Resource path) to the list of denied
         * methods and includes a condition for the policy statement. More on AWS policy
         * conditions here: http://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements.html#Condition
         *
         * @method denyMethodWithConditions
         * @param {String} The HTTP verb for the method, this should ideally come from the
         *                 AuthPolicy.HttpVerb object to avoid spelling mistakes
         * @param {string} The resource path. For example "/pets"
         * @param {Object} The conditions object in the format specified by the AWS docs
         * @return {void}
         */
        denyMethodWithConditions: function (verb, resource, conditions) {
          addMethod.call(this, "deny", verb, resource, conditions);
        },

        /**
         * Generates the policy document based on the internal lists of allowed and denied
         * conditions. This will generate a policy with two main statements for the effect:
         * one statement for Allow and one statement for Deny.
         * Methods that includes conditions will have their own statement in the policy.
         *
         * @method build
         * @return {Object} The policy object that can be serialized to JSON.
         */
        build: function () {
          if ((!this.allowMethods || this.allowMethods.length === 0) &&
            (!this.denyMethods || this.denyMethods.length === 0)) {
            throw new Error("No statements defined for the policy");
          }

          var policy = {};
          policy.principalId = this.principalId;
          var doc = {};
          doc.Version = this.version;
          doc.Statement = [];

          doc.Statement = doc.Statement.concat(getStatementsForEffect.call(this, "Allow", this.allowMethods));
          doc.Statement = doc.Statement.concat(getStatementsForEffect.call(this, "Deny", this.denyMethods));

          policy.policyDocument = doc;

          return policy;
        }
      };

    })();
  }
};


//Download PEM for your UserPool if not already downloaded


//with node module

/*const constant = require('./constant');
const authorizer = require('cognito-express');
const cognitoExpress = new authorizer({
  region: constant.COGNITO.REGION,
  cognitoUserPoolId: constant.COGNITO.POOL_ID,
  tokenUse: constant.COGNITO.TOKEN, //Possible Values: access | id
  tokenExpiration: 3600000 //Up to default expiration of 1 hour (3600000 ms)
});

module.exports = function(event) {
  const token = event.headers.Authorization;
  return new Promise((resolve,reject)=>{
    cognitoExpress.validate(token, function(err, response) {
      if (err) {
        /!*
			//API is not authenticated, do something with the error.
			//Perhaps redirect user back to the login page

			//ERROR TYPES:

			//If accessTokenFromClient is null or undefined
			err = {
				"name": "TokenNotFound",
				"message": "access token not found"
			}

			//If tokenuse doesn't match accessTokenFromClient
			{
				"name": "InvalidTokenUse",
				"message": "Not an id token"
			}

			//If token expired
			err = {
				"name": "TokenExpiredError",
				"message": "jwt expired",
				"expiredAt": "2017-07-05T16:41:59.000Z"
			}

			//If token's user pool doesn't match the one defined in constructor
			{
				"name": "InvalidUserPool",
				"message": "access token is not from the defined user pool"
			}

		*!/
        reject(err);
      } else {
        //Else API has been authenticated. Proceed.
        //res.locals.user = response; //Optional - if you want to capture user information
        console.log(response);
        resolve(response);
      }
    });
  });
};*/



