'use strict';

var qlikauth = require('../qlik-auth');
var request = require('request');
var ejs = require('ejs');
var fs = require('fs');
var qendpoint = require('../../config/endpoint');
var WebSocket = require('ws');
var Logger = require('../model/userModel');
var dashboardFinder = require('../../config/dashboard_finder');
var colors = require('colors');

var admin = {


  getSession: function(req, res, next) {
  
   //console.log(req.headers);
   //console.log(req.cookies);
   res.json(req.cookies);
  },

  test: function(req, res, next) {
  
   var creator= req.params['0'];

   if(creator.indexOf('nscr')>-1 && creator.indexOf('user/')>-1){
    var required= creator.lastIndexOf("user/");

    
   var dual=creator.substring(required+5);

   var user_directory = dual.substring(0,dual.indexOf('/'));
   var user_id = dual.substring(dual.indexOf('/')+1);
    //console.log('required',user_directory,user_id);
   }


   next();
  },


  roleverifier: function(ticket,cb){
    
    //console.log('roleverifier',ticket);
    
    var ticket= JSON.parse(ticket);
    //console.log(ticket.Ticket)
    var ws = new WebSocket('ws://10.2.5.158/node/app/f083256e-3ea6-4a4b-97fa-ed72e5700554?reloadUri=http://10.2.5.158/node/dev-hub/engine-api-explorer&QlikTicket='+ticket.Ticket
    );
    var opendocIntegrated = {"method":"OpenDoc","params":['f083256e-3ea6-4a4b-97fa-ed72e5700554',"","","",false],"handle":-1,"id":1,"jsonrpc":"2.0"}
    var getobject= {
      "handle": 1,
      "method": "GetObject",
      "params": {
        "qId": "kKpRS"
      },
      "id":2
    }
     
    var getlayout= {
            "method": "GetLayout",
            "handle": 2,
            "params": [],
            "outKey": -1,
            "jsonrpc": "2.0",
            "id": 3
          }
              
    ws.on('open', function open() {
       ws.send(JSON.stringify(opendocIntegrated));
    });

    //**************************** INCOMING MESSAGE EVENT *****************************
    ws.on('message', function(data , flags) {
      
     
     
      var s = JSON.parse(data);
            
      
      if(s.id==1){
        
            ws.send(JSON.stringify(getobject));
          }


        if(s.id==2){
            ws.send(JSON.stringify(getlayout));
          }
         if(s.id==3){
            var role =s.result.qLayout.qHyperCube.qGrandTotalRow[0].qText;
            console.log(role);
            if (role =='Executive'){
              cb(null,'/scr/ticket/user/associates/qlikdeveloper5?client_id=merlin&scope=ticket&open=http://10.2.5.158/node/sense/app/f083256e-3ea6-4a4b-97fa-ed72e5700554/sheet/a0072aff-1354-4855-939d-97c8151ddd85/state/analysis')
             
            } 
            else{
              //window.open('http://10.2.5.158/node/sense/app/f083256e-3ea6-4a4b-97fa-ed72e5700554/sheet/bMPTA/state/analysis',"_self");
              cb(null,'/scr/ticket/user/associates/qlikdeveloper5?client_id=merlin&scope=ticket&open=http://10.2.5.158/node/sense/app/f083256e-3ea6-4a4b-97fa-ed72e5700554/sheet/bMPTA/state/analysis')
              
            }
          }
    });
      


  },

  saveHistory: function(req, res, next) {

    var user_id= req.param.user_id;
    var sheet_name = req.param.sheet_name;
    var count;
    var date = new Date();
      var logger = {};
      logger.request_path = req.path;
      logger.client_ip = req.headers.origin;
      logger.server_ip = req.connection.remoteAddress;
      logger.time = date;

      function appendObject(obj){
              var configFile = fs.readFileSync('./user_log.json');
              var config = JSON.parse(configFile);
              config.push(obj);
              var configJSON = JSON.stringify(config);
              fs.writeFileSync('./user_log.json', configJSON);
            }
      
      appendObject(logger);
      return;
  },

  getHistory: function(req, res, next) {

    var configFile = fs.readFileSync('./user_log.json');
    var config = JSON.parse(configFile);
    res.json(config);
  },

  mashupDynamiser: function(req, res, next) {

    var configFile = fs.readFileSync('./mashup-id.json');
    var config = JSON.parse(configFile);
    res.json(config);
  },

  saveLogger: function(req, res, next){

    if(!req.params['0'] || !req.params.user_id || !req.query.client_id || !req.query.scope){
      console.log("Log not saved.".bgRed.bold)
      next();
    }else{
      var log_json = {
        user_id:req.params['0'],
        user_directory:req.params.user_id,
        client_id:req.query.client_id,
        scope:req.query.scope,
        service_name:req.query.service_name
      }
      if(req.query.open){
        let open_var = req.query.open;
        open_var = open_var.split('?')[0];
        let dashboard_name;
        let application;
        if(dashboardFinder.hasOwnProperty(open_var)){
          dashboard_name = dashboardFinder[open_var][0];
          application = dashboardFinder[open_var][1];
        }else{
          next();
        }
        log_json.dashboard_name = dashboard_name;
        log_json.application = application;
      }
      if(req.headers.origin){
        log_json.local_ip = req.headers.origin.substring('::ffff:'.length);
      }else if(req.connection.remoteAddress){
        log_json.server_ip = req.connection.remoteAddress.substring('::ffff:'.length);
      }

      var logger = new Logger(log_json);
      logger.save(function(err, logData){
        if(err){
          console.log("Error in saving logs-- ".underline.red, err);
          next();
        }else{
          console.log("log saved.".inverse);
          next();
        }
      })
    }
  }
};
module.exports = admin;