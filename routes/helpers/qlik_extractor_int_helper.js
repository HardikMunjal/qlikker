'use strict';

var qlikauth = require('../qlik-auth');
var request = require('request');
var ejs = require('ejs');
var fs = require('fs');
var WebSocket = require('ws');
var utility = require('../utility/getSession')

//var node_xj = require("xls-to-json");


var opendoc= {"method":"OpenDoc","params":["4f9d54a0-007c-4873-a7e2-fef56dda55db","","","",false],"handle":-1,"id":1,"jsonrpc":"2.0"}
var getobject= {"method":"GetObject","handle":1,"params":["QwRpdK"],"id":2,"jsonrpc":"2.0"};
var gethypercube = {"method":"GetHyperCubeData","handle":2,"params":["/qHyperCubeDef",[
{"qTop":0,"qLeft":0,"qHeight":8,"qWidth":7}
]],"id":3,"jsonrpc":"2.0"}



var businessInsights = [];
var performance=false;
var pipeline=false;


var ehelper = {


  fetchDetails: function(integerator, cb) {

      console.log('fetch details execution starts');
      utility.checkSession(integerator,function(err,result){

          if(result == 'Session does not exist for the user'){
             
             utility.checkTicket(integerator,function(err,result){
              var bodyObject =JSON.parse(result);
              var socketIntegerator = {};
              socketIntegerator.token= bodyObject.Ticket;
              socketIntegerator.target='TICKET';
              socketIntegerator.scope='BI';
              socketIntegerator.user_id= integerator.user_id;
              socketIntegerator.user_directory= integerator.user_directory;
              

               utility.getSocketData(socketIntegerator,function(err,bomb){

                return cb(null,bomb);
               })

             })

          }
         else{

            var bodyObject =JSON.parse(result);
            var socketIntegerator = {};
            socketIntegerator.token= bodyObject[0].SessionId;
            socketIntegerator.target='SESSION';
            socketIntegerator.scope='BI';
            socketIntegerator.user_id= integerator.user_id;
            socketIntegerator.user_directory= integerator.user_directory;
            
            utility.getSocketData(socketIntegerator,function(err,bomb){

            return cb(null,bomb);

           })
         }

      });
    }


  };
module.exports = ehelper;
