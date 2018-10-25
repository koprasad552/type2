module.exports = {

  settings: [
    {
      "businessType": 1,
      "isCurrent": true,
      "enableAutoAllocation":false,
      "actionBlock": {
        "notes": {
          "exist": true,
          "isMandatory": false
        },

        "image": {"exist": false, "isMandatory": false},
        "signature": {"exist": false, "isMandatory": false},
        "barcode": {"exist": false, "isMandatory": false},
        "imageCaption": {"exist": false, "isMandatory": false}
      },

      "acknowledgementType": 1,
      "notifications": {
        "Received": {
          "web": true,
          "sms": true,
          "email": false,
          "smsTemp": 'Hi [CustomerName], your [pickUp] request has been received and it is scheduled for [StartDate] before [StartTime].' ,
          "mailTemp": 'Hi [CustomerName],Your [pickUp] request has been received and it is scheduled for [StartDate] before [StartTime]. Best,Team [CompanyName]'
        },
        "Started": {
          "web": true,
          "sms": true,
          "email": false,
          "smsTemp": 'Hi [CustomerName], our member [AgentName] is on its way. To track the location live on the map open http://apps.deliforce.io/track/[taskId].',
          "mailTemp": 'Hey [CustomerName],Our member [AgentName] is on its way. To track the location live on the map open http://apps.deliforce.io/track/[taskId] Best,Team [CompanyName].'
        },
        "Arrived": {
          "web": true,
          "sms": true,
          "email": false,
          "smsTemp": 'Hi [CustomerName], our fleet member [AgentName] has reached the destination. Please say hi and handover the [pickUp] consignment.',
          "mailTemp": 'Hi [CustomerName], Our fleet member [AgentName] has reached the destination. Please say hi and handover the [pickUp] consignment. Best,Team[CompanyName]'
        },
        "Success": {
          "web": true,
          "sms": true,
          "email": false,
          "smsTemp": 'Hi [CustomerName]! Your consignment was successfully [pickUp] up today at [CompletedTime]. Please rate your experience http://apps.deliforce.io/rating/[taskId].',
          "mailTemp": 'Hi [CustomerName],Your consignment was successfully [pickUp] up today at [CompletedTime]. Please rate your experience http://apps.deliforce.io/rating/[taskId] Best, Team [CompanyName]'
        },
        "Failed": {
          "web": true,
          "sms": true,
          "email": false,
          "smsTemp": 'Hi [CustomerName]! We tried, but were unable to [pickUp] your consignment today at [CompletedTime]. Please contact us at [ManagerNumber]',
          "mailTemp": 'Hi [CustomerName],We tried, but were unable to [pickUp] your consignment today at [CompletedTime]. Please contact us at [ManagerNumber].Best, Team [CompanyName]'
        }
      },

      "autoAllocation": {
        "nearest": {
          "radius": 16,
          "current": false,
          "expiry": 30,
          "retries": 10
        },

        "sendToAll": {
          "current": false,
          "expiry": 30,
          "retries": 10
        },
        "oneByOne": {
          "current": true,
          "expiry": 30,
          "retries": 10
        }
      }
    },
    {
      "businessType": 2,
      "isCurrent": false,
      "enableAutoAllocation":false,

      "actionBlock": {
        "notes": {
          "exist": true,
          "isMandatory": false
        },

        "image": {"exist": false, "isMandatory": false},
        "signature": {"exist": false, "isMandatory": false},
        "barcode": {"exist": false, "isMandatory": false},
        "imageCaption": {"exist": false, "isMandatory": false}
      },

      "acknowledgementType": 1,
      "notifications": {

        "Received": {
          "web": true,
          "sms": true,
          "email": false,
          "smsTemp": 'Hi [CustomerName], your [pickUp] request has been received and it is scheduled for [StartDate] before [StartTime].',
          "mailTemp": 'Hi [CustomerName],Your [pickUp] request has been received and it is scheduled for [StartDate] before [StartTime]. Best,Team [CompanyName]'
        },
        "Started": {
          "web": true,
          "sms": true,
          "email": false,
          "smsTemp": 'Hi [CustomerName], our member [AgentName] is on its way. To track the location live on the map open http://apps.deliforce.io/track/[taskId]',
          "mailTemp": 'Hey [CustomerName],Our member [AgentName] is on its way. To track the location live on the map open http://apps.deliforce.io/track/[taskId] Best,Team [CompanyName]'
        },
        "Arrived": {
          "web": true,
          "sms": true,
          "email": false,
          "smsTemp": 'Hi [CustomerName], our fleet member [AgentName] has reached the destination. Please say hi and handover the [pickUp] consignment.',
          "mailTemp": 'Hi [CustomerName], Our fleet member [AgentName] has reached the destination. Please say hi and handover the [pickUp] consignment. Best,Team[CompanyName]'
        },
        "Success": {
          "web": true,
          "sms": true,
          "email": false,
          "smsTemp": 'Hi [CustomerName]! Your consignment was successfully [pickUp] up today at [CompletedTime]. Please rate your experience http://apps.deliforce.io/rating/[taskId]',
          "mailTemp": 'Hi [CustomerName],Your consignment was successfully [pickUp] up today at [CompletedTime]. Please rate your experience http://apps.deliforce.io/rating/[taskId] Best, Team [CompanyName]'
        },
        "Failed": {
          "web": true,
          "sms": true,
          "email": false,
          "smsTemp": 'Hi [CustomerName]! We tried, but were unable to [pickUp] your consignment today at [CompletedTime]. Please contact us at [ManagerNumber]',
          "mailTemp": 'Hi [CustomerName],We tried, but were unable to [pickUp] your consignment today at [CompletedTime]. Please contact us at [ManagerNumber].Best,Team [CompanyName]'
        }
      },

      "autoAllocation": {
        "nearest": {
          "radius": 16,
          "current": false,
          "expiry": 30,
          "retries": 10
        },

        "sendToAll": {
          "current": false,
          "expiry": 30,
          "retries": 10
        },
        "oneByOne": {
          "expiry": 30,
          "current": true,
          "retries": 10
        }
      }
    },
    {
      "businessType": 3,
      "isCurrent": false,
      "enableAutoAllocation":false,

      "actionBlock": {
        "notes": {
          "exist": true,
          "isMandatory": false
        },

        "image": {"exist": false, "isMandatory": false},
        "signature": {"exist": false, "isMandatory": false},
        "barcode": {"exist": false, "isMandatory": false},
        "imageCaption": {"exist": false, "isMandatory": false}
      },
      "acknowledgementType": 1,
      "notifications": {

        "Received": {
          "web": true,
          "sms": true,
          "email": false,
          "smsTemp": 'Hi [CustomerName], your [pickUp] request has been received and it is scheduled for [StartDate] before [StartTime].',
          "mailTemp": 'Hi [CustomerName],Your [pickUp] request has been received and it is scheduled for [StartDate] before [StartTime]. Best,Team [CompanyName]'
        },
        "Started": {
          "web": true,
          "sms": true,
          "email": false,
          "smsTemp": 'Hi [CustomerName], our member [AgentName] is on its way. To track the location live on the map open  http://apps.deliforce.io/track/[taskId].',
          "mailTemp": 'Hey [CustomerName],Our member [AgentName] is on its way. To track the location live on the map open http://apps.deliforce.io/track/[taskId] Best,Team [CompanyName].'
        },
        "Arrived": {
          "web": true,
          "sms": true,
          "email": false,
          "smsTemp": 'Hi [CustomerName], our fleet member [AgentName] has reached the destination. Please say hi and handover the [pickUp] consignment.',
          "mailTemp": 'Hi [CustomerName], Our fleet member [AgentName] has reached the destination. Please say hi and handover the [pickUp] consignment. Best,Team[CompanyName]'
        },
        "Success": {
          "web": true,
          "sms": true,
          "email": false,
          "smsTemp": 'Hi [CustomerName]! Your consignment was successfully [pickUp] up today at [CompletedTime]. Please rate your experience http://apps.deliforce.io/rating/[taskId]',
          "mailTemp": 'Hi [CustomerName],Your consignment was successfully [pickUp] up today at [CompletedTime]. Please rate your experience http://apps.deliforce.io/rating/[taskId] Best, Team [CompanyName]'
        },
        "Failed": {
          "web": true,
          "sms": true,
          "email": false,
          "smsTemp": 'Hi [CustomerName]! We tried, but were unable to [pickUp] your consignment today at [CompletedTime]. Please contact us at [ManagerNumber].',
          "mailTemp": 'Hi [CustomerName],We tried, but were unable to [pickUp] your consignment today at [CompletedTime]. Please contact us at [ManagerNumber].Best,Team [CompanyName]'
        }
      },

      "autoAllocation": {
        "nearest": {
          "radius": 16,
          "current": false,
          "expiry": 30,
          "retries": 10
        },

        "sendToAll": {
          "current": false,
          "expiry": 30,
          "retries": 10
        },
        "oneByOne": {
          "expiry": 30,
          "current": true,
          "retries": 10
        }
      }
    }],
  preference: {
    'customizeAgentTextAs': 'Driver',
    'customizeManagerTextAs': 'Manager',
    'dashboardLanguage': {'text': 'English', 'id': 'en'},
    'customerTrackingLanguage': {'text': 'English', 'id': 'en'},
    'timeZone': {
      // 'text': 'India Standard Time',
      'abbr': 'IST',
      'offset': 5.5,
      'isdst': false,
      'text': '(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi',
      ' utc': ['Asia/Kolkata']

    },
    'distance': {'text': 'Kilometer', 'id': 1}
  }
};
