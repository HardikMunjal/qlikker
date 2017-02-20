'use strict';

var qlikauth = require('./qlik-auth');
var request = require('request');
var ejs = require('ejs');
var fs = require('fs');
var WebSocket = require('ws');



var qlik = {


checkSession: function(data, cb) {
  request('http://10.2.5.160:4011/scr/session/user/'+req.params.user_directory+'/'+req.params.user_id+'?client_id=merlin&scope=session', function (error, response, body) {

      if (!error && response.statusCode == 200) {

        cb(null,data);

        

      }
    });
  },


  checkTicket: function(data, cb) {
  request('http://10.2.5.160:4011/scr/ticket/user/'+req.params.user_directory+'/'+req.params.user_id+'?client_id=merlin&scope=ticket', function (error, response, body) {

      if (!error && response.statusCode == 200) {

        cb(null,data);

        

      }
    });
  },
  getSocketData: function(data, cb) {

    if(data.target=='TICKET'){

      var ws = new WebSocket(
                  'ws://10.2.5.160/ps/app/4f9d54a0-007c-4873-a7e2-fef56dda55db?reloadUri=http://10.2.5.160/ps/dev-hub/engine-api-explorer&QlikTicket='+bodyObject.Ticket
              );

    }
    else if(data.target=='SESSION'){
      
      var ws = new WebSocket(
                'ws://10.2.5.160/ps/app/4f9d54a0-007c-4873-a7e2-fef56dda55db?reloadUri=http://10.2.5.160/ps/dev-hub/engine-api-explorer',
                [],
                {
                    'headers': {
                        'Cookie': 'X-Qlik-Session-Ps='+bodyObject[0].SessionId
                    }
                }
            );
    }
    
    if(data.scope=='BI'){
      websocketUtility.extractBusinessInsightsData(data,function(err, bomb){
          return
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