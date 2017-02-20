'use strict';

var qlikauth = require('../qlik-auth');
var request = require('request');
var ejs = require('ejs');
var fs = require('fs');
var WebSocket = require('ws');


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


  fetchDetails: function(req, res, next) {

      console.log('fetch details execution starts');
      utility.checkSession(data,function(err,bomb){

        if(bomb == 'Session does not exist for the user'){

           utility.checkTicket(data,function(err,bomb){

             utility.getSocketData(data,function(err,bomb){

              return;
             })

           })

       }
       

       utility.getSocketData(data,function(err,bomb){

        return

       })

     });
   }
  }

};
module.exports = ehelper;
