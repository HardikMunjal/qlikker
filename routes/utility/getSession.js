'use strict';

var qlikauth = require('../qlik-auth');
var request = require('request');
var ejs = require('ejs');
var fs = require('fs');
var WebSocket = require('ws');
var websocketUtility = require('../utility/websocket')
var websocketSymUtility = require('../utility/websocket/symphony_ws')
var qendpoint = require('../../config/endpoint')


var qlik = {


checkSession: function(integerator, cb) {

  
  request(qendpoint.qlik_pt+'scr/session/user/'+integerator.user_directory+'/'+integerator.user_id+'?client_id=merlin&scope=session', function (error, response, body) {

      if (!error && response.statusCode == 200) {

        cb(null,body);

        

      }
    });
  },


  checkTicket: function(integerator, cb) {
  request(qendpoint.qlik_pt+'scr/ticket/user/'+integerator.user_directory+'/'+integerator.user_id+'?client_id=merlin&scope=ticket', function (error, response, body) {

      if (!error && response.statusCode == 200) {

        cb(null,body);

        

      }
    });
  },
  getSocketData: function(data, cb) {

    
    if(data.scope=='BI'){


      websocketUtility.extractBusinessInsightsData(data,function(err, bomb){
          return cb(err,bomb);
         })
      }

    else if(data.scope=='NewBI'){
      websocketUtility.extractNewBIData(data,function(err, bomb){
      return cb(err,bomb);
      })
    }

    else if(data.scope=='Leaderboard'){
      websocketUtility.extractLeaderData(data,function(err, bomb){
          return cb(err,bomb);
         })
      }
    else if(data.scope=='Leaderdeepdive'){
      websocketUtility.extractLeaderDeepdive(data,function(err, bomb){
          return cb(err,bomb);
         })
      }

    else if(data.scope=='symphony'){
      websocketUtility.extractSymphonydata(data,function(err, bomb){
          return cb(err,bomb);
         })
      }

    else if(data.scope=='financedata'){
      websocketSymUtility.extractFinanceData(data,function(err, bomb){
          return cb(err,bomb);
         })
      }

    else if(data.scope=='CARD'){
      websocketUtility.extractCardData(data,function(err, bomb){
          return 
         })
      }
   }
};
module.exports = qlik;