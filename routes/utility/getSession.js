'use strict';

var qlikauth = require('../qlik-auth');
var request = require('request');
var ejs = require('ejs');
var fs = require('fs');
var WebSocket = require('ws');
//var websocketUtility = require('../utility/websocket')
var websocketSymUtility = require('../utility/websocket/symphony_ws');
var websocketMerlinUtility = require('../utility/websocket/merlin_ws');
var qendpoint = require('../../config/endpoint');


var qlik = {


checkSession: function(integerator, cb) {

  
  request(qendpoint.qlik_pt+'scr/session/user/'+integerator.user_directory+'/'+integerator.user_id+'?client_id='+integerator.client_id+'&scope=session&service_name='+integerator.scope, function (error, response, body) {

      if (!error && response.statusCode == 200) {

        cb(null,body);
      }
    });
  },


  checkTicket: function(integerator, cb) {
  request(qendpoint.qlik_pt+'scr/ticket/user/'+integerator.user_directory+'/'+integerator.user_id+'?client_id='+integerator.client_id+'&scope=ticket&service_name='+integerator.scope, function (error, response, body) {

      if (!error && response.statusCode == 200) {

        cb(null,body);
      }
    });
  },
  getSocketData: function(data, cb) {

    switch(data.scope){

      case "BI":
      websocketMerlinUtility.extractBusinessInsightsData(data,function(err, bomb){
         return cb(err,bomb);
      })
      break;

      case "sales":
      websocketMerlinUtility.extractSalesData(data,function(err, bomb){
        return cb(err,bomb);
      })
      break;

      case "NewBI":
      websocketSymUtility.extractNewBIData(data,function(err, bomb){
        return cb(err,bomb);
      })
      break;

      case "Leaderboard":
      websocketMerlinUtility.extractLeaderData(data,function(err, bomb){
          return cb(err,bomb);
      })
      break;

      case "Leaderdeepdive":
      websocketMerlinUtility.extractLeaderDeepdive(data,function(err, bomb){
          return cb(err,bomb);
      })
      break;

      case "symphony":
      websocketSymUtility.extractSymphonydata(data,function(err, bomb){
          return cb(err,bomb);
      })
      break;

      case "financedata":
      websocketSymUtility.extractFinanceData(data,function(err, bomb){
          return cb(err,bomb);
      })
      break;

      case "valuedata":
      websocketSymUtility.extractValueData(data,function(err, bomb){
          return cb(err,bomb);
      })
      break;

      case "LeaderboardBilling":
      websocketMerlinUtility.extractLeaderBillingData(data,function(err, bomb){
          return cb(err,bomb);
      })
      break;
    }
   }
};
module.exports = qlik;