const result = require('./result');
const taskModel = require('./model').TASK;
const helper = require('./util');
const constant = require('./constant')();
const taskS = constant.TASK_STATUS;
const empty = require('is-empty');
const mongoose = require('mongoose');
const _ = require('lodash');
const moment = require('moment');


module.exports = {

  ontime: (event, cb, principals) => {
    const data = helper.getQueryData(event);

    if (!data) {
      result.invalidInput(cb);
    }

    const query = formQuery(principals, data);

    if (!empty(data.filter.teamFilter)) {
      query.$match.$and.push({'driverDetails.assignTeam': mongoose.Types.ObjectId(data.filter.teamFilter)})

    }
    if (!empty(data.filter.driverFilter)) {
      query.$match.$and.push({'driverDetails._id': mongoose.Types.ObjectId(data.filter.driverFilter)})
      ;
    }
    if (!empty(data.filter.dateFilter.length)) {

      var startDate = moment(data.filter.dateFilter[0]).startOf('day')
      var dateMidnight = moment(data.filter.dateFilter[1]).endOf('day')

      query.$match.$and.push({date: {"$gte": new Date(startDate), "$lte": new Date(dateMidnight)}});
    }
    else{
      result.invalidDate(cb);
    }


    if (!empty(data.filter.businessType)) {
      query.$match.$and.puh({businessType: data.filter.businessType});

    }


    console.log(query);

    taskModel.aggregate(
      [


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
            delayStatus: '$delay'
          }
        },


        {
          "$group": {
            "_id": {
              "yearMonthDay": "$yearMonthDay",
              "delayStatus": "$delayStatus"
            },
            "delayStatus": {"$sum": 1}
          }
        },
        {
          "$group": {
            "_id": "$_id.yearMonthDay",
            "delayStatus": {
              "$push": {
                "delayStatus": "$_id.delayStatus",
                "count": "$delayStatus"
              },
            },
            "count": {"$sum": "$delayStatus"}
          }
        }

      ]
    ).then((resultData) => {
      //res.json(data);
      var datesArry = getDates(new Date(data.filter.dateFilter[0]), new Date(data.filter.dateFilter[1])).map((date) => {
        // console.log(date)
        return this.newData = date.toISOString().slice(0, 10);
      });

      let ourObject = [];
      const mock = {
        "delayStatus": [
          {
            "delayStatus": 0,
            "count": 0
          },
          {
            "delayStatus": 1,
            "count": 0
          }

        ],
        "count": 0

      };
      datesArry.forEach((v) => {
        ourObject.push(Object.assign({_id: v}, mock));
      });

      console.log(ourObject);

      var mergedList = _.map(ourObject, function (item) {
        const find = _.find(resultData, {_id: item._id});
        if (find) {
          const ts = _.unionBy(find.delayStatus, item.delayStatus, "delayStatus");

          return _.extend(item, {delayStatus: ts}, {count: find.count});
        } else {
          return item;
        }
      });

      result.sendSuccess(cb, mergedList)
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
      '$and': [{'taskStatus': taskS.SUCCESS}]
    }
  }
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
    query.$match.$and.push({'clientId': principals['clientId']})
    var teams = principals['teams'];
    teams = teams.map((team) => {
      return mongoose.Types.ObjectId(team);
    })

    query.$match.$and.push({'driverDetails.assignTeam': {'$in': teams}});
  }
  console.log(query);
  return query;
}

function getDates(startDate, endDate) {


  let dates = [];
  this.currentDate = startDate;
  let addDays = function (days) {
    let date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  };
  while (this.currentDate <= endDate) {
    dates.push(this.currentDate);
    this.currentDate = addDays.call(this.currentDate, 1);
  }
  return dates;
// Usage

}
