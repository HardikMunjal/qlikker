'use strict';

var qlikauth = require('../qlik-auth');
var request = require('request');
var ejs = require('ejs');
var fs = require('fs');
var WebSocket = require('ws');
var websocketUtility = require('../utility/websocket')


var qlik = {


checkSession: function(integerator, cb) {
  request('http://10.2.5.160:4011/scr/session/user/'+integerator.user_directory+'/'+integerator.user_id+'?client_id=merlin&scope=session', function (error, response, body) {

      if (!error && response.statusCode == 200) {

        cb(null,body);

        

      }
    });
  },


  checkTicket: function(integerator, cb) {
  request('http://10.2.5.160:4011/scr/ticket/user/'+integerator.user_directory+'/'+integerator.user_id+'?client_id=merlin&scope=ticket', function (error, response, body) {

      if (!error && response.statusCode == 200) {

        cb(null,body);

        

      }
    });
  },
  getSocketData: function(data, cb) {

    
    if(data.scope=='BI'){


      websocketUtility.extractBusinessInsightsData(data,function(err, bomb){
          return cb(null,bomb);
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