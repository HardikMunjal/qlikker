'use strict';

var qlikauth = require('../qlik-auth');
var request = require('request');
var ejs = require('ejs');
var fs = require('fs');
var WebSocket = require('ws');
var utility = require('../utility/getSession')




var businessInsights = [];
var performance=false;
var pipeline=false;


var ehelper = {


  fetchDetails: function(integerator, cb) {

      //console.log('fetch details execution starts');
      utility.checkSession(integerator,function(err,result){

          if(result == 'Session does not exist for the user'){
             
             utility.checkTicket(integerator,function(err,result){
              var bodyObject =JSON.parse(result);
              var socketIntegerator = {};
              socketIntegerator.token= bodyObject.Ticket;
              socketIntegerator.target='TICKET';
              socketIntegerator.scope=integerator.scope;
              socketIntegerator.user_id= integerator.user_id;
              socketIntegerator.user_directory= integerator.user_directory;
              

               utility.getSocketData(socketIntegerator,function(err,bomb){

                return cb(err,bomb);
               })

             })

          }
         else{

            var bodyObject =JSON.parse(result);
            var socketIntegerator = {};
            socketIntegerator.token= bodyObject[0].SessionId;
            socketIntegerator.target='SESSION';
            socketIntegerator.scope=integerator.scope;
            socketIntegerator.user_id= integerator.user_id;
            socketIntegerator.user_directory= integerator.user_directory;
            
            utility.getSocketData(socketIntegerator,function(err,bomb){

            return cb(err,bomb);

           })
         }

      });
    }


  };
module.exports = ehelper;
