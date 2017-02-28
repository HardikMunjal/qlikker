'use strict';

var qlikauth = require('../qlik-auth');
var request = require('request');
var ejs = require('ejs');
var fs = require('fs');
var WebSocket = require('ws');
var qendpoint = require('../../config/endpoint');

var opendoc= {"method":"OpenDoc","params":["ad50b54a-38f0-4d6f-aae3-7c77d91d4940","","","",false],"handle":-1,"id":1,"jsonrpc":"2.0"}
var getobject= {"method":"GetObject","handle":1,"params":["wJscr"],"id":2,"jsonrpc":"2.0"};
var gethypercube = {"method":"GetHyperCubeData","handle":2,"params":["/qHyperCubeDef",[
{"qTop":0,"qLeft":0,"qHeight":12,"qWidth":9}
]],"id":3,"jsonrpc":"2.0"}



var businessInsights = [];


var qlik = {


extractBusinessInsightsData: function(data,cb) {
   
console.log(data);

if(data.target=='TICKET'){

      var ws = new WebSocket(
                  qendpoint.qlik_ws+'app/ad50b54a-38f0-4d6f-aae3-7c77d91d4940?reloadUri='+qendpoint.qlik_proxy_pt+'dev-hub/engine-api-explorer&QlikTicket='+data.token
              );

    }
    else if(data.target=='SESSION'){
      
      var ws = new WebSocket(
                qendpoint.qlik_ws+'app/ad50b54a-38f0-4d6f-aae3-7c77d91d4940?reloadUri='+qendpoint.qlik_proxy_pt+'dev-hub/engine-api-explorer',
                [],
                {
                    'headers': {
                        'Cookie': 'X-Qlik-Session-Ps='+data.token
                    }
                }
            );
    }
    

              ws.on('open', function open() {
                console.log('connection1 opened for sales performance with Session');
                  
                ws.send(JSON.stringify(opendoc));
              });

            ws.on('message', function(data, flags) {
                      
              var wsres = JSON.parse(data);
              console.log(wsres);
              if(wsres.params && wsres.params.logoutUri == qendpoint.ws_logout+'qps/user'){
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
                  var biarray = {};
                   biarray.index = null;
                   biarray.underlyingLogic = null;
                   biarray.category = null;
                   biarray.insightTitle = null;
                   biarray.count = null;
                   biarray.value = null;
                   biarray.status = null;
                   biarray.url = null;
                   businessInsights.push(biarray);
                   biarray={};
                  cb(null,businessInsights);
                  businessInsights=[];
                  return;
                }

                for(var i=0;i<wsres.result.qDataPages[0].qMatrix.length;i++){
                   
                   var biarray = {};
                   biarray.index = wsres.result.qDataPages[0].qMatrix[i][1].qText;
                   biarray.underlyingLogic = wsres.result.qDataPages[0].qMatrix[i][2].qText;
                   biarray.category = wsres.result.qDataPages[0].qMatrix[i][3].qText;
                   biarray.Title = wsres.result.qDataPages[0].qMatrix[i][4].qText;
                   biarray.count = wsres.result.qDataPages[0].qMatrix[i][5].qText;
                   biarray.value = wsres.result.qDataPages[0].qMatrix[i][6].qText;
                   biarray.status = wsres.result.qDataPages[0].qMatrix[i][7].qText;
                   biarray.url = wsres.result.qDataPages[0].qMatrix[i][8].qText;
                   businessInsights.push(biarray);
                   biarray={};
                }
                cb(null,businessInsights);
                businessInsights=[];
                console.log('Performance Business insights from sesssion');
                
              }
            });

  
  },

  extractCardData: function(data,cb) {
   



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
                  var biarray = {};
                   biarray.index = null;
                   biarray.underlyingLogic = null;
                   biarray.category = null;
                   biarray.insightTitle = null;
                   biarray.count = null;
                   biarray.value = null;
                   biarray.url = null;
                   businessInsights.push(biarray);
                   biarray={};
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
                
              }
            });

  

   


  }

  
};
module.exports = qlik;