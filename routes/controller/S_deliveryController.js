'use strict';

var qlikauth = require('../qlik-auth');
//var ehelper = require('./helpers/qlik_extractor_helper')
var einthelper = require('../helpers/qlik_extractor_int_helper')
var request = require('request');
var ejs = require('ejs');
var fs = require('fs');
var WebSocket = require('ws');



var qlik = { 
  
qlikNewBIData: function(req, res, next) {


if(!req.params.user_id && !req.params.user_directory){
 res.send('User must have to pass directory and user_id', 400);
 return;
}

var integerator = {};
integerator.user_id = req.params.user_id;
integerator.user_directory = req.params.user_directory;
integerator.scope = 'NewBI';
integerator.client_id = "delivery";
einthelper.fetchDetails(integerator,function(err,result){
if(!err){
  //console.log('result',result);
  return res.json(result);
}
else{
  
        return res.send(err.message);
      }
})
},

  financeData: function(req, res, next) {


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
   integerator.scope = 'financedata';
   integerator.client_id = "delivery";

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

   },59000)
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


valueData: function(req, res, next) {


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
   integerator.scope = 'valuedata';
   integerator.client_id = "delivery";

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

   },59000)
   einthelper.fetchDetails(integerator,function(err,result){
    if(!err){

      if(!responseStatus){
        qlikstatus=true;
        // console.log('result',result);
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

symphonytest: function(req, res, next) {



 var integerator = {};
 var qlikstatus = false;
 var responseStatus = false;

 integerator.user_id = req.params.user_id;
 integerator.user_directory = req.params.user_directory;
 integerator.scope = 'delivery';

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

 },15000)
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