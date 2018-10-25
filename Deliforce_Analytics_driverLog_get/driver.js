const result = require('./result');
const DriverLog = require('./model');
const helper = require('./util');
const moment = require('moment');
const _ = require('lodash');
const empty = require('is-empty');
const mongoose = require('mongoose');

module.exports = {
  driverLog: (event, cb, principals) => {
    const data = helper.getQueryData(event);
    console.log(data);
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
    console.log(query);
    DriverLog.aggregate(
      [
        query,

        {
          $project: {
            yearMonthDay: {$dateToString: {format: "%Y-%m-%d", date: "$date"}},
            time: {$dateToString: {format: "%H:%M:%S:%L", date: "$date"}},
            'idleTime': "$idleTime",
            'activeTime': '$activeTime',
            'idleDist': '$idleDist',
            'activeDist': '$activeDist'
          }
        },
        {
          $group:
            {
              _id: {"yearMonthDay": "$yearMonthDay"},

              'idleTime': {$sum: "$idleTime"},
              'activeTime': {$sum: "$activeTime"},
              'idleDist': {$sum: "$idleDist"},
              'activeDist': {$sum: "$activeDist"},
              driversCount: {$sum: 1}
            }
        }


      ]
    ).then((resultData) => {
      var datesArry = getDates(new Date(data.filter.dateFilter[0]), new Date(data.filter.dateFilter[1])).map((date) => {

        return this.newData = date.toISOString().slice(0, 10);
      });

      let ourObject = [];
      const mock = {
        'idleTime': 0, 'activeTime': 0, 'idleDist': 0, 'activeDist': 0
      }

      datesArry.forEach((v) => {
        ourObject.push(Object.assign({_id: {'yearMonthDay': v}}, mock));
      });


      var resultarry = ourObject.map(function (ld) {
        var find = resultData.find((db) => db._id.yearMonthDay === ld._id.yearMonthDay);
        return (find) ? find : ld;
      });
      console.log(resultarry);
      result.sendSuccess(cb, resultarry);

    }).catch((error) => {
      console.log(error);
      result.sendServerError(cb)
    });

  }

};


function formQuery(principals, qryData) {


  var defaultQuery = {

    '$match': {
      '$and': []
      //'driverDetails.name':'praveen'
    }

  }
  const query = defaultQuery;
  // if (qryData.filter && qryData.filter.search) {
  //   //TODO This should be optimised with common search & fields structure. ex: fields:['teamName','description']
  //   query.name = {$regex: `.*${qryData.filter.search}.*`};
  // }

  //add auth query
  if (helper.isAdmin(principals)) {
    query.$match.$and.push({'clientId': principals['sub']})

  } else {
    //manager
    query.$match.$and.push({'clientId': principals['clientId']})
    var teams = principals['teams'];
    teams = teams.map((team) => {
      return mongoose.Types.ObjectId(team)
    })
    query.$match.$and.push({'assignTeam': teams})

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
