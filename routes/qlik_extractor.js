'use strict';

var qlikauth = require('./qlik-auth');
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

var opendoc1= {"method":"OpenDoc","params":["b73cfc0d-92fe-481b-8bb9-6290feefc5d4","","","",false],"handle":-1,"id":1,"jsonrpc":"2.0"}
var getobject1= {"method":"GetObject","handle":1,"params":["nKCHjD"],"id":2,"jsonrpc":"2.0"};
var gethypercube1 = {"method":"GetHyperCubeData","handle":2,"params":["/qHyperCubeDef",[
                                {"qTop":0,"qLeft":0,"qHeight":8,"qWidth":7}
                ]],"id":3,"jsonrpc":"2.0"}


var businessInsights = [];
var performance=false;
var pipeline=false;


var qlik = {


  qlikdata: function(req, res, next) {



   

    var bhai =[];

    if(!req.params.user_id && !req.params.user_directory){
     res.send('User must have to pass directory and user_id', 400);
     return;
    }

   

     function fetchDetails(){


      request('http://10.2.5.160:4011/scr/session/user/'+req.params.user_directory+'/'+req.params.user_id+'?client_id=merlin&scope=session', function (error, response, body) {
        
        if (!error && response.statusCode == 200) {

          if(body != 'Session does not exist for the user'){
            
            var bodyObject =JSON.parse(body);
            var ws = new WebSocket(
                'ws://10.2.5.160/ps/app/4f9d54a0-007c-4873-a7e2-fef56dda55db?reloadUri=http://10.2.5.160/ps/dev-hub/engine-api-explorer',
                [],
                {
                    'headers': {
                        'Cookie': 'X-Qlik-Session-Ps='+bodyObject[0].SessionId
                    }
                }
            );

              ws.on('open', function open() {
                console.log('connection1 opened for sales performance with Session');
                  
                ws.send(JSON.stringify(opendoc));
              });

            ws.on('message', function(data, flags) {
                      
              var wsres = JSON.parse(data);
              if(wsres.params && wsres.params.logoutUri == 'ws://10.2.5.160:80/ps/qps/user'){
                console.log('user is successfully logged in sales performance with session')
              }
              if(wsres.id==1){
                ws.send(JSON.stringify(getobject));
              }
              if(wsres.id==2){
                //console.log(wsres);
                ws.send(JSON.stringify(gethypercube));
              }
              if(wsres.id==3){

                if (!wsres.result) {
                  console.log('no records');
                  return;
                }

                for(var i=0;i<wsres.result.qDataPages[0].qMatrix.length;i++){
                   
                   var biarray = {};
                   biarray.index = wsres.result.qDataPages[0].qMatrix[i][0].qText;
                   biarray.underlyingLogic = wsres.result.qDataPages[0].qMatrix[i][1].qText;
                   biarray.category = wsres.result.qDataPages[0].qMatrix[i][2].qText;
                   biarray.insightTitle = wsres.result.qDataPages[0].qMatrix[i][3].qText;
                   biarray.count = wsres.result.qDataPages[0].qMatrix[i][4].qText;
                   biarray.value = wsres.result.qDataPages[0].qMatrix[i][5].qText;
                   biarray.url = wsres.result.qDataPages[0].qMatrix[i][6].qText;
                   businessInsights.push(biarray);
                   biarray={};
                }
                console.log('Performance Business insights from sesssion');
                //console.log(businessInsights);
                performance = true;
                if(pipeline){
                  console.log('performance completed session');
                  res.json(businessInsights);
                  businessInsights=[];
                  pipeline=false;
                  performance=false;
                }
                
              }
            });

            }
            else{

            console.log('going for ticket for sales performance');
            request('http://10.2.5.160:4011/scr/ticket/user/'+req.params.user_directory+'/'+req.params.user_id+'?client_id=merlin&scope=ticket', function (error, response, body) {
               var dynamicTicket=body;

            
            if (!error && response.statusCode == 200) {

              var bodyObject =JSON.parse(body);

              var ws = new WebSocket(
                  'ws://10.2.5.160/ps/app/4f9d54a0-007c-4873-a7e2-fef56dda55db?reloadUri=http://10.2.5.160/ps/dev-hub/engine-api-explorer&QlikTicket='+bodyObject.Ticket
              );

              ws.on('open', function open() {
                console.log('connection opened for sales performance with ticket');
                  
                ws.send(JSON.stringify(opendoc));
              });

            ws.on('message', function(data, flags) {
              
        
              var wsres = JSON.parse(data);

              if(wsres.params && wsres.params.logoutUri == 'ws://10.2.5.160:80/ps/qps/user'){
                
                console.log('user is successfully logged in sales performance with ticket')
              }
              if(wsres.id==1){
                ws.send(JSON.stringify(getobject));
              }
              if(wsres.id==2){
                //console.log(wsres);
                ws.send(JSON.stringify(gethypercube));
              }
              if(wsres.id==3){
                                
                if (!wsres.result) {
                  console.log('no records');
                  return;
                }

                for(var i=0;i<wsres.result.qDataPages[0].qMatrix.length;i++){
                   
                   var biarray = {};
                   biarray.index = wsres.result.qDataPages[0].qMatrix[i][0].qText;
                   biarray.underlyingLogic = wsres.result.qDataPages[0].qMatrix[i][1].qText;
                   biarray.category = wsres.result.qDataPages[0].qMatrix[i][2].qText;
                   biarray.insightTitle = wsres.result.qDataPages[0].qMatrix[i][3].qText;
                   biarray.count = wsres.result.qDataPages[0].qMatrix[i][4].qText;
                   biarray.value = wsres.result.qDataPages[0].qMatrix[i][5].qText;
                   biarray.url = wsres.result.qDataPages[0].qMatrix[i][6].qText;
                   businessInsights.push(biarray);
                   biarray={};
                }
                performance = true;
                console.log('business insights from sales performance using ticket')
                //console.log(businessInsights);
                if(pipeline){
                  console.log('performance completed with ticket');
                  res.json(businessInsights);
                  businessInsights=[];
                  performance = false;
                  pipeline = false;
                }
                
              }
              
            });
               
            }
          })

        }
      }
    });


      //******************************* Second Application **********************************************

      request('http://10.2.5.160:4011/scr/session/user/'+req.params.user_directory+'/'+req.params.user_id+'?client_id=merlin&scope=session', function (error, response, body) {
        
        if (!error && response.statusCode == 200) {

          if(body != 'Session does not exist for the user'){

            var bodyObject =JSON.parse(body);
            var ws1 = new WebSocket(
                'ws://10.2.5.160/ps/app/b73cfc0d-92fe-481b-8bb9-6290feefc5d4?reloadUri=http://10.2.5.160/ps/dev-hub/engine-api-explorer',
                [],
                {
                    'headers': {
                        'Cookie': 'X-Qlik-Session-Ps='+bodyObject[0].SessionId
                    }
                }
            );

              ws1.on('open', function open() {
                console.log('connection opened for sales pipeline with Session');
                
                  
                ws1.send(JSON.stringify(opendoc1));
              });

            ws1.on('message', function(data, flags) {
              
        
              var wsres1 = JSON.parse(data);


              if(wsres1.params && wsres1.params.logoutUri == 'ws://10.2.5.160:80/ps/qps/user'){
                
                console.log('user is successfully logged in sales pipeline with session')
              }
              if(wsres1.id==1){
               
                ws1.send(JSON.stringify(getobject1));
              }
              if(wsres1.id==2){
                
                ws1.send(JSON.stringify(gethypercube1));
              }
              if(wsres1.id==3){
                
                if (!wsres1.result) {
                  console.log('no records');
                  return;
                }
                for(var i=0;i<wsres1.result.qDataPages[0].qMatrix.length;i++){
                   
                   var biarray = {};
                   biarray.index = wsres1.result.qDataPages[0].qMatrix[i][0].qText;
                   biarray.underlyingLogic = wsres1.result.qDataPages[0].qMatrix[i][1].qText;
                   biarray.category = wsres1.result.qDataPages[0].qMatrix[i][2].qText;
                   biarray.insightTitle = wsres1.result.qDataPages[0].qMatrix[i][3].qText;
                   biarray.count = wsres1.result.qDataPages[0].qMatrix[i][4].qText;
                   biarray.value = wsres1.result.qDataPages[0].qMatrix[i][5].qText;
                   biarray.url = wsres1.result.qDataPages[0].qMatrix[i][6].qText;
                   businessInsights.push(biarray);
                   biarray={};
                }
                pipeline = true;
                console.log('businessInsights for sales pipeline with session');
                //console.log(businessInsights);
                if(performance){
                console.log('pipeline completed with session');
                 res.json(businessInsights);
                 businessInsights=[];
                 pipeline = false;
                 performance = false;

               }
                
              }
              
            });

            }
            else{

          

          console.log('going for ticket for sales pipeline');
          request('http://10.2.5.160:4011/scr/ticket/user/'+req.params.user_directory+'/'+req.params.user_id+'?client_id=merlin&scope=ticket', function (error, response, body) {
            var dynamicTicket=body;

            
            if (!error && response.statusCode == 200) {

              var bodyObject =JSON.parse(body);

              var ws1 = new WebSocket(
                  'ws://10.2.5.160/ps/app/b73cfc0d-92fe-481b-8bb9-6290feefc5d4?reloadUri=http://10.2.5.160/ps/dev-hub/engine-api-explorer&QlikTicket='+bodyObject.Ticket
              );

              ws1.on('open', function open() {
                console.log('connection opened for sales pipeline with ticket');
                  
                ws1.send(JSON.stringify(opendoc1));
              });

            ws1.on('message', function(data, flags) {
              
        
              var wsres1 = JSON.parse(data);

              //console.log('websocket 1',wsres);

              if(wsres1.params && wsres1.params.logoutUri == 'ws://10.2.5.160:80/ps/qps/user'){
                
                console.log('user is successfully logged in sales pipeline with ticket')
              }
              if(wsres1.id==1){
                
                ws1.send(JSON.stringify(getobject1));
              }
              if(wsres1.id==2){
                
                ws1.send(JSON.stringify(gethypercube1));
              }
              if(wsres1.id==3){
                
                if (!wsres1.result) {
                  console.log('no records');
                  return;
                }

                for(var i=0;i<wsres1.result.qDataPages[0].qMatrix.length;i++){
                   
                   var biarray = {};
                   biarray.index = wsres1.result.qDataPages[0].qMatrix[i][0].qText;
                   biarray.underlyingLogic = wsres1.result.qDataPages[0].qMatrix[i][1].qText;
                   biarray.category = wsres1.result.qDataPages[0].qMatrix[i][2].qText;
                   biarray.insightTitle = wsres1.result.qDataPages[0].qMatrix[i][3].qText;
                   biarray.count = wsres1.result.qDataPages[0].qMatrix[i][4].qText;
                   biarray.value = wsres1.result.qDataPages[0].qMatrix[i][5].qText;
                   biarray.url = wsres1.result.qDataPages[0].qMatrix[i][6].qText;
                   businessInsights.push(biarray);
                   biarray={};
                }
                console.log('business Insights completed sales pipeline ticket'); 
                //console.log(businessInsights);
                pipeline = true;
                if(performance){
                console.log('business insights completed sales pipeline ticket');
                 res.json(businessInsights);
                 businessInsights=[];
                 performance = false;
                 pipeline = false;
              }
                
              }
              
            });
               
            }
          })

        }
      }
    });

      
      }
    fetchDetails();
  }

  
};
module.exports = qlik;