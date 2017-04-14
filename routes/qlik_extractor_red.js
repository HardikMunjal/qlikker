'use strict';

var qlikauth = require('./qlik-auth');
//var ehelper = require('./helpers/qlik_extractor_helper')
var einthelper = require('./helpers/qlik_extractor_int_helper')
var request = require('request');
var ejs = require('ejs');
var fs = require('fs');
var WebSocket = require('ws');


var opendoc= {"method":"OpenDoc","params":["4f9d54a0-007c-4873-a7e2-fef56dda55db","","","",false],"handle":-1,"id":1,"jsonrpc":"2.0"}
var getobject= {"method":"GetObject","handle":1,"params":["QwRpdK"],"id":2,"jsonrpc":"2.0"};
var gethypercube = {"method":"GetHyperCubeData","handle":2,"params":["/qHyperCubeDef",[
{"qTop":0,"qLeft":0,"qHeight":8,"qWidth":7}
]],"id":3,"jsonrpc":"2.0"}


var qlik = {


  qlikdata: function(req, res, next) {


    if(!req.params.user_id && !req.params.user_directory){
       res.send('User must have to pass directory and user_id', 400);
       return;
     }
     console.log('ehelper execution starts');
     ehelper.fetchDetails(req,res);
  },

   qlikdataOptimized: function(req, res, next) {


    if(!req.params.user_id && !req.params.user_directory){
       res.send('User must have to pass directory and user_id', 400);
       return;
     }
     
     var integerator = {};
     integerator.user_id = req.params.user_id;
     integerator.user_directory = req.params.user_directory;
     integerator.scope = 'BI';
     einthelper.fetchDetails(integerator,function(err,result){
     	if(!err){
     		//console.log('result',result);
     		res.json(result);
     	}
     })
  },

  qlikLeaderData: function(req, res, next) {


    // ws://10.2.5.158/app/3e0df6e8-8809-4fdc-8a88-00e35926db24?reloadUri=http://10.2.5.158/dev-hub/engine-api-explorer
    // CPhuYnm
    // jCmVxbs


    if(!req.params.user_id && !req.params.user_directory){
       res.send('User must have to pass directory and user_id', 400);
       return;
     }
     
     var integerator = {};
     integerator.user_id = req.params.user_id;
     integerator.user_directory = req.params.user_directory;
     integerator.scope = 'Leaderboard';
     einthelper.fetchDetails(integerator,function(err,result){
      if(!err){
        //console.log('result',result);
        return res.json(result);
        //console.log('ho gya');
        
      }
     })
  }


};
module.exports = qlik;