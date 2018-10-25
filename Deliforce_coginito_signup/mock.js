module.exports = {
  event: {
    "resource": "/signup",
    "path": "/signup",
    "httpMethod": "POST",
    "headers": {
      "Accept": "application/json, text/plain, */*",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "en-US,en;q=0.9",
      "CloudFront-Forwarded-Proto": "https",
      "CloudFront-Is-Desktop-Viewer": "true",
      "CloudFront-Is-Mobile-Viewer": "false",
      "CloudFront-Is-SmartTV-Viewer": "false",
      "CloudFront-Is-Tablet-Viewer": "false",
      "CloudFront-Viewer-Country": "IN",
      "content-type": "application/json",
      "Host": "8qccyeh61h.execute-api.ap-south-1.amazonaws.com",
      "origin": "http://localhost:4200",
      "Referer": "http://localhost:4200/signup",
      "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36",
      "Via": "2.0 428accddf0bcba8a5fca3432ef227861.cloudfront.net (CloudFront)",
      "X-Amz-Cf-Id": "6tHPQ1_xV1BL_3RUsgZllcReuR0LPps4dH_2YRu0gP3ItJ-qEgiJGw==",
      "X-Amzn-Trace-Id": "Root=1-5aaac96b-408167b095662fba751d15ee",
      "X-Forwarded-For": "106.51.73.130, 54.239.160.112",
      "X-Forwarded-Port": "443",
      "X-Forwarded-Proto": "https"
    },
    "queryStringParameters": null,
    "pathParameters": null,
    "stageVariables": null,
    "requestContext": {
      "requestTime": "15/Mar/2018:19:28:43 +0000",
      "path": "/Development/signup",
      "accountId": "221980681332",
      "protocol": "HTTP/1.1",
      "resourceId": "kz9alt",
      "stage": "Development",
      "requestTimeEpoch": 1521142123561,
      "requestId": "12c841aa-2887-11e8-8075-47ac7627d06c",
      "identity": {
        "cognitoIdentityPoolId": null,
        "accountId": null,
        "cognitoIdentityId": null,
        "caller": null,
        "sourceIp": "106.51.73.130",
        "accessKey": null,
        "cognitoAuthenticationType": null,
        "cognitoAuthenticationProvider": null,
        "userArn": null,
        "userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36",
        "user": null
      },
      "resourcePath": "/signup",
      "httpMethod": "POST",
      "apiId": "8qccyeh61h"
    },
    "body": "{\"name\":\"stevejobs\",\"email\":\"stevejobs@gmail.com\",\"password\":\"Stevejobs@123\",\"phone\":\"+91 323343456232\"}",
    "isBase64Encoded": false
  },

  managerPrincipal: {
    sub: '80bfae83-2983-41ce-8961-23e2bcc2571b', role: 2,
    clientId: '23de5879-eb1a-40a4-9e3b-52d342f36490', teams: ['5aaa6c6fd25929612872c2ef', '5aaa6c6fd25929612872c2f1']
  },
  adminPrincipal: {
    sub: '23de5879-eb1a-40a4-9e3b-52d342f36490', role: 1,
  },

  data: {
    email: 'eshwar@gmail.com', phone: '+91 43233222323', name: 'arul', password: 'Eshwar@123',
    permissions: {
      allowAccessToUnassigned: false,
      allowCreateTask: true,
      allowEditTask: false,
      allowAddDriver: true
    }
  }
}
