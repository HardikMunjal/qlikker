'use strict';

var qlikauth = require('./qlik-auth');
var request = require('request');
var ejs = require('ejs');
var fs = require('fs');
var WebSocket = require('ws');




var qlik = {


  qlikdata: function(req, res, next) {
   



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
                
              }
            });

  

   


  }

  
};
module.exports = qlik;