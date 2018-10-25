const result = require('./result');
const taskModel = require('./model').TASK;
const userModel = require('./model').USER;
const helper = require('./util');
const mongoose = require('mongoose');
const empty = require('is-empty');
const moment = require('moment');

const _ = require('lodash');


module.exports = {

  getTopAgent: (event, cb, principals) => {
    const data = helper.getQueryData(event);
    let clientId = null;
    let query = {
      $match: {
        $and: [

        ]
      }
    }

    if (!data) {
      result.invalidInput(cb);
    }

    if (helper.isAdmin(principals)) {
      clientId = principals['sub'];
    }
    else {
      clientId = principals['clientId'];
      let teams = principals['teams'];
      teams = teams.map((team) => {
        return mongoose.Types.ObjectId(team);
      });
      query.$match.$and.push({assignTeam:{'$in': teams}});
    }
    query.$match.$and.push({'clientId': clientId})



    if (!empty(data.filter.teamFilter)) {
      query.$match.$and.push({'assignTeam': mongoose.Types.ObjectId(data.filter.teamFilter)});
    }
    if (!empty(data.filter.driverFilter)) {
      query.$match.$and.push({'_id': mongoose.Types.ObjectId(data.filter.driverFilter)})

    }
    if (!empty(data.filter.dateRangeFilter)) {
      // 1 month data
      var startOfMonth = moment(data.filter.dateRangeFilter[0]).startOf('month');
      var endOfMonth = moment(data.filter.dateRangeFilter[1]).endOf('month');

      // 1 day data
      // var startDate = moment(data.filter.dateRangeFilter[0]).startOf('day');
      // var dateMidnight = moment(data.filter.dateRangeFilter[1]).endOf('day');
      query.$match.$and.push({'taskDetails.date': {"$gte": new Date(startOfMonth), "$lte": new Date(endOfMonth)}});
      // query.$match.$and.push({Date: {"$gte": new Date(startDate), "$lte": new Date(dateMidnight)}});
    }


    console.log(JSON.stringify(query), "query");

    userModel.aggregate([

      {

        $lookup:
          {
            from: 'tasks',
            localField: '_id',
            foreignField: 'driver',
            as: 'taskDetails'
          }
      },

      {'$unwind': "$taskDetails"},
      query, //after live need to remove comments don't forget

      {
        "$group": {
          "_id": {
            "driverName": "$name",
            "taskStatus": "$taskDetails.taskStatus"
          },
          "taskStatus": {"$sum": 1}
        }
      },
      {
        "$group": {
          "_id": "$_id.driverName",
          "taskStatus": {
            "$push": {
              "Status": "$_id.taskStatus",
              "count": "$taskStatus"
            },
          },
          "Totalcount": {"$sum": "$taskStatus"}
        }
      }

    ]).then((resultData) => {

      console.log(JSON.stringify(resultData));
      const mock = {
        "taskStatus": [
          {
            "Status": 1,
            "count": 0
          },
          {
            "Status": 2,
            "count": 0
          },
          {
            "Status": 3,
            "count": 0
          },
          {
            "Status": 4,
            "count": 0
          },
          {
            "Status": 5,
            "count": 0
          },
          {
            "Status": 6,
            "count": 0
          },
          {
            "Status": 7,
            "count": 0
          },
          {
            "Status": 8,
            "count": 0
          },
          {
            "Status": 9,
            "count": 0
          }
        ],
        count: 0
      };

      if (resultData.length) {
        var finalOutput = resultData.map((data) => {
          //console.log(data,'data')
          //merging if particular task status is not therer
          const ts = _.unionBy(data._id, data.taskStatus, mock.taskStatus, "Status");
          return _.extend(data, {taskStatus: ts}, {count: data.count});
        });

        //accuracy count
        _.each(finalOutput, function (value, key) {
          console.log(value, key);
          const successObject = _.find(value.taskStatus, function (o) {
            return o.Status === 6;
          });//success tasks
          const successCount = successObject.count;
          console.log('dummy', successCount);
          Object.assign(value, {'accuracy': Math.floor((successCount / value.Totalcount) * 100)})
        });
        console.log(JSON.stringify(finalOutput));
        //sorting based on the accuracy

        finalOutput.sort(function (a, b) {
          return b.accuracy - a.accuracy
        });

        finalOutput.slice(0, 10);

      }// if no record found
      else {
        finalOutput = [];
        console.log('+++Empty Data'+finalOutput);
      }

      result.sendSuccess(cb, finalOutput)
    })
      .catch((error) => {
        console.log(error);
        result.sendServerError(cb)
      });

  }
};



