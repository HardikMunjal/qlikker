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
     //console.log('ehelper execution starts');
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
    var emessage = {};
       emessage.error_id = 400;
       emessage.error_message ='Invalid User Name';

    if(!req.params.user_id && !req.params.user_directory){


       res.send(emessage, 400);
       return;
     }
     if(req.params.user_id == 'null' || req.params.user_directory == 'null'){
       res.send(emessage, 400);
       return;
     }

     if(req.params.user_id == 'undefined' || req.params.user_directory == 'undefined'){
       res.send(emessage, 400);
       return;
     }

     //console.log(req.params.user_id);
     
     var integerator = {};
     var qlikstatus = false;
     var responseStatus = false;

     integerator.user_id = req.params.user_id;
     integerator.user_directory = req.params.user_directory;
     integerator.scope = 'Leaderboard';

     setTimeout(function(){
       if(!qlikstatus){
        
        var e ={};
        var emessage = {};
        emessage.error_id = 403.1;
        emessage.error_message ='Either you do not have license pass in qliksense or may be qlikservices are down';
        res.status('403');
        e.message = emessage;
        responseStatus=true;

        
         return res.send(e.message);
       }

     },12000)
     einthelper.fetchDetails(integerator,function(err,result){
      if(!err){

        if(!responseStatus){
          qlikstatus=true;
          //console.log('result',result);
          return res.json(result);
        }
        else{
          console.log('*************** error captured in set timeout reqquired debugging ***************')
        }
      }
      else{
        qlikstatus=true;
        //console.log(err);
        //res.status(err.status);
        
        return res.send(err.message);
        //return next(err)
      }
     })
  }


};
module.exports = qlik;