const result = require('./result');
const taskModel = require('./model').TASK;
const helper = require('./util');
const mongoose = require('mongoose');
const empty = require('is-empty');
const moment = require('moment');

const _ = require('lodash');


module.exports = {


  taskComplete: (event, cb, principals) => {
    const data = helper.getQueryData(event);

    if (!data) {
      result.invalidInput(cb);
    }

    const query = formQuery(principals, data);

    if (!empty(data.filter.teamFilter)) {
      query.$match.$and.push({'driverDetails.assignTeam': mongoose.Types.ObjectId(data.filter.teamFilter)});
    }

    if (!empty(data.filter.driverFilter)) {
      query.$match.$and.push({'driverDetails._id': mongoose.Types.ObjectId(data.filter.driverFilter)});
    }

    if (!empty(data.filter.dateFilter.length)) {
      //var startDate = moment(data.filter.dateFilter[0]).startOf('day');
      //var dateMidnight = moment(data.filter.dateFilter[1]).endOf('day');

      startDate = new Date(data.filter.dateFilter[0]);
      startDate.setSeconds(0);
      startDate.setHours(0);
      startDate.setMinutes(0);
      //for day End Time
      dateMidnight = new Date(data.filter.dateFilter[1]);
      dateMidnight.setHours(23);
      dateMidnight.setMinutes(59);
      dateMidnight.setSeconds(59);

      query.$match.$and.push({date: {"$gte": new Date(startDate), "$lte": new Date(dateMidnight)}});
      // query.$match.$and.push({Date: {"$gte": new Date(startDate), "$lte": new Date(dateMidnight)}});
    }

    if (!empty(data.filter.categoryFilter)) {
      query.$match.$and.push({businessType: data.filter.categoryFilter});
    }

    console.log(query);

    taskModel.aggregate(
      [
        //{'$match':{category:(!empty(body.filter.categoryFilter))? body.filter.categoryFilter :''}},
        {
          $lookup: {
            from: 'users',
            localField: 'driver',
            foreignField: '_id',
            as: 'driverDetails'
          }
        },

        query,

        {
          $project: {
            yearMonthDay: {$dateToString: {format: "%Y-%m-%d", date: "$date"}},
            time: {$dateToString: {format: "%H:%M:%S:%L", date: "$date"}},
            'driver': "$driverDetails",
            'taskStatus': '$taskStatus',
            'category': '$category'
          }
        },


        {
          "$group": {
            "_id": {
              "yearMonthDay": "$yearMonthDay",
              "taskStatus": "$taskStatus"
            },
            "taskStatus": {"$sum": 1}
          }
        },
        {
          "$group": {
            "_id": "$_id.yearMonthDay",
            "taskStatus": {
              "$push": {
                "taskStatus": "$_id.taskStatus",
                "count": "$taskStatus"
              },
            },
            "count": {"$sum": "$taskStatus"}
          }
        },
        {$sort: {"_id": 1}}
      ]
    ).then((resultData) => {
      console.log('Result DAta '+resultData);

      var datesArry = getDates(new Date(data.filter.dateFilter[0]), new Date(data.filter.dateFilter[1])).map((date) => {
        // console.log(date)
        return this.newData = date.toISOString().slice(0, 10);
      });

      console.log('Result DAta '+JSON.stringify(resultData));
      let ourObject = [];
      const mock = {
        "taskStatus": [
          {
            "taskStatus": 1,
            "count": 0
          },
          {
            "taskStatus": 2,
            "count": 0
          },
          {
            "taskStatus": 3,
            "count": 0
          },
          {
            "taskStatus": 4,
            "count": 0
          },
          {
            "taskStatus": 5,
            "count": 0
          },
          {
            "taskStatus": 6,
            "count": 0
          },
          {
            "taskStatus": 7,
            "count": 0
          },
          {
            "taskStatus": 8,
            "count": 0
          },
          {
            "taskStatus": 9,
            "count": 0
          },

          {
            "taskStatus": 10,
            "count": 0
          },
          {
            "taskStatus": 14,
            "count": 0
          }
        ],
        count: 0
      };
      datesArry.forEach((v) => {
        ourObject.push(Object.assign({_id: v}, mock));
      });

      var mergedList = _.map(ourObject, function (item) {
        const find = _.find(resultData, {_id: item._id});
        if (find) {
          const ts = _.unionBy(find.taskStatus, item.taskStatus, "taskStatus");
          return _.extend(item, {taskStatus: ts}, {count: find.count});
        } else {
          return item;
        }
      });
      console.log('mergedList'+JSON.stringify(mergedList));
      result.sendSuccess(cb, mergedList);
    })
      .catch((error) => {
        console.log(error);
        result.sendServerError(cb)
      });
  }


};


function formQuery(principals, qryData) {
  const defaultQuery = {
    '$match': {
      '$and': []
    }
  };
  const query = defaultQuery;
  // if (qryData.filter && qryData.filter.search) {
  //   //TODO This should be optimised with common search & fields structure. ex: fields:['teamName','description']
  //   query.name = {$regex: `.*${qryData.filter.search}.*`};
  // }

  //add auth query
  if (helper.isAdmin(principals)) {
    query.$match.$and.push({'clientId': principals['sub']});

  } else {
    //manager
    query.$match.$and.push({'clientId': principals['clientId']});
    var teams = principals['teams'];
    teams = teams.map((team) => {
      return mongoose.Types.ObjectId(team);
    });
    query.$match.$and.push({'driverDetails.assignTeam': {'$in': teams}});
  }
  console.log('testing query'+JSON.stringify(query));
  return query;
}

function getDates(startDate, endDate) {

  console.log('startDate'+startDate);
  console.log('end date'+endDate);


  let dates = [];
  this.currentDate = new Date(startDate);
  endDate = new Date(endDate);
  let addDays = function (days) {
    let date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  };
  while (this.currentDate <= endDate) {
    console.log("current date check"+this.currentDate);
    dates.push(this.currentDate);
    this.currentDate = addDays.call(this.currentDate, 1);
  }
  console.log('Date check '+dates);
  return dates;
// Usage

}
