'use strict';

var qlikauth = require('../qlik-auth');
//var ehelper = require('./helpers/qlik_extractor_helper')
var einthelper = require('../helpers/qlik_extractor_int_helper')
var request = require('request');
var ejs = require('ejs');
var fs = require('fs');
var WebSocket = require('ws');



var qlik = {

   qlikdataOptimized: function(req, res, next) {


    if(!req.params.user_id && !req.params.user_directory){
       res.send('User must have to pass directory and user_id', 400);
       return;
     }
     
     var integerator = {};
     integerator.user_id = req.params.user_id;
     integerator.user_directory = req.params.user_directory;
     integerator.scope = 'BI';
     integerator.client_id = "merlin";
     einthelper.fetchDetails(integerator,function(err,result){
      if(!err){
        res.json(result);
      }else{
        //qlikstatus=true;
        return res.send(err.message);
      }
     })
  },
  /*qlikSalesdata: function(req, res, next) {


  if(!req.params.user_id && !req.params.user_directory){
   res.send('User must have to pass directory and user_id', 400);
   return;
  }

  var integerator = {};
  integerator.user_id = req.params.user_id;
  integerator.user_directory = req.params.user_directory;
  integerator.scope = 'sales';
  integerator.client_id = "merlin";
  einthelper.fetchDetails(integerator,function(err,result){
  if(!err){
    //console.log('result',result);
    res.json(result);
  }
  })
  },*/

  qlikSalesdata: function(req, res, next) {


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
     var integerator = {};
     var qlikstatus = false;
     var responseStatus = false;

     integerator.user_id = req.params.user_id;
     integerator.user_directory = req.params.user_directory;
     integerator.scope = 'sales';
     integerator.client_id = "merlin";
     
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

     },19000)
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
        return res.send(err.message);
      }
     })
  },
  qlikLeaderData: function(req, res, next) {


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
     var integerator = {};
     var qlikstatus = false;
     var responseStatus = false;

     integerator.user_id = req.params.user_id;
     integerator.user_directory = req.params.user_directory;
     integerator.scope = 'Leaderboard';
     integerator.client_id = "merlin";

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

     },42000)
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
        return res.send(err.message);
      }
     })
  },
  qlikLeaderDeepdive: function(req, res, next) {


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
     var integerator = {};
     var qlikstatus = false;
     var responseStatus = false;

     integerator.user_id = req.params.user_id;
     integerator.user_directory = req.params.user_directory;
     integerator.scope = 'Leaderdeepdive';
     integerator.client_id = "merlin";

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

     },45000)
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
        return res.send(err.message);
      }
     })
  },
  qlikLeaderBilling: function(req, res, next){

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
     var integerator = {};
     var qlikstatus = false;
     var responseStatus = false;

     integerator.user_id = req.params.user_id;
     integerator.user_directory = req.params.user_directory;
     integerator.scope = 'LeaderboardBilling';
     integerator.client_id = "merlin";

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

     },45000)
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
        return res.send(err.message);
      }
     })
  }

};
module.exports = qlik;