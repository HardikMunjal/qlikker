'use strict';

var qlikauth = require('../qlik-auth');
var request = require('request');
var ejs = require('ejs');
var fs = require('fs');
var WebSocket = require('ws');
var qendpoint = require('../../config/endpoint');

var opendoc= {"method":"OpenDoc","params":["83dc76e7-6d76-455f-9052-e71da06a5c93","","","",false],"handle":-1,"id":1,"jsonrpc":"2.0"}
var getobject= {"method":"GetObject","handle":1,"params":["wJscr"],"id":2,"jsonrpc":"2.0"};
var gethypercube = {"method":"GetHyperCubeData","handle":2,"params":["/qHyperCubeDef",[
{"qTop":0,"qLeft":0,"qHeight":12,"qWidth":9}
]],"id":3,"jsonrpc":"2.0"}


var opendocForLeaderboard= {"method":"OpenDoc","params":["3e0df6e8-8809-4fdc-8a88-00e35926db24","","","",false],"handle":-1,"id":1,"jsonrpc":"2.0"}

var getobjectForLeaderboard= {"method":"GetObject","handle":1,"params":["CPhuYnm"],"id":2,"jsonrpc":"2.0"};
var getlayoutForLeaderboard= {"method":"GetLayout","handle":2,"params":[],"id":3};
var gethypercubeForLeaderboard = {"method":"GetHyperCubeData","handle":2,"params":["/qHyperCubeDef",[
{"qTop":0,"qLeft":0,"qHeight":12,"qWidth":9}
]],"id":4,"jsonrpc":"2.0"}


var getobjectForLeaderboardPipeline= {"method":"GetObject","handle":1,"params":["jFGBSQ"],"id":5,"jsonrpc":"2.0"};
var getlayoutForLeaderboardPipeline= {"method":"GetLayout","handle":3,"params":[],"id":6};


var getobjectForBillingFocusLeader= {"method":"GetObject","handle":1,"params":["JWDGS"],"id":7,"jsonrpc":"2.0"};
var gethypercubeForBillingingFocusLeader = {"method":"GetHyperCubeData","handle":4,"params":["/qHyperCubeDef",[
{"qTop":0,"qLeft":0,"qHeight":7,"qWidth":4}
]],"id":8,"jsonrpc":"2.0"}


var getobjectForBookingFocusLeader= {"method":"GetObject","handle":1,"params":["NyLHWD"],"id":9,"jsonrpc":"2.0"};
var gethypercubeForBookingFocusLeader = {"method":"GetHyperCubeData","handle":5,"params":["/qHyperCubeDef",[
{"qTop":0,"qLeft":0,"qHeight":10,"qWidth":4}
]],"id":10,"jsonrpc":"2.0"}

var getobjectForPipelineFocusLeader= {"method":"GetObject","handle":1,"params":["NyLHWD"],"id":11,"jsonrpc":"2.0"};
var gethypercubeForPipelineFocusLeader = {"method":"GetHyperCubeData","handle":5,"params":["/qHyperCubeDef",[
{"qTop":0,"qLeft":0,"qHeight":10,"qWidth":4}
]],"id":12,"jsonrpc":"2.0"}


var getobjectForBookingOppurtunityLeader= {"method":"GetObject","handle":1,"params":["tQujdg"],"id":13,"jsonrpc":"2.0"};
var gethypercubeForBookingOppurtunityLeader = {"method":"GetHyperCubeData","handle":6,"params":["/qHyperCubeDef",[
{"qTop":0,"qLeft":0,"qHeight":10,"qWidth":7}
]],"id":14,"jsonrpc":"2.0"}

var getobjectForPipelineOppurtunityLeader= {"method":"GetObject","handle":1,"params":["PAEwpnZ"],"id":15,"jsonrpc":"2.0"};
var gethypercubeForPipelineOppurtunityLeader = {"method":"GetHyperCubeData","handle":7,"params":["/qHyperCubeDef",[
{"qTop":0,"qLeft":0,"qHeight":10,"qWidth":7}
]],"id":16,"jsonrpc":"2.0"}





var businessInsights = [];


var qlik = {


extractBusinessInsightsData: function(data,cb) {
   
console.log(data);

if(data.target=='TICKET'){

      var ws = new WebSocket(
                  qendpoint.qlik_ws+'app/83dc76e7-6d76-455f-9052-e71da06a5c93?reloadUri='+qendpoint.qlik_proxy_pt+'dev-hub/engine-api-explorer&QlikTicket='+data.token
              );

    }
    else if(data.target=='SESSION'){
      
      var ws = new WebSocket(
                qendpoint.qlik_ws+'app/83dc76e7-6d76-455f-9052-e71da06a5c93?reloadUri='+qendpoint.qlik_proxy_pt+'dev-hub/engine-api-explorer',
                [],
                {
                    'headers': {
                        'Cookie': 'X-Qlik-Session-Node='+data.token
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

  extractLeaderData: function(data,cb) {
   
      console.log(data);
      var leaderData = {};
      leaderData.FocusAccounts =[];
      leaderData.TopOpportunityList =[];

      if(data.target=='TICKET'){

            var ws = new WebSocket(
                        qendpoint.qlik_ws+'app/3e0df6e8-8809-4fdc-8a88-00e35926db24?reloadUri='+qendpoint.qlik_proxy_pt+'dev-hub/engine-api-explorer&QlikTicket='+data.token
                    );

          }
          else if(data.target=='SESSION'){
            
            var ws = new WebSocket(
                      qendpoint.qlik_ws+'app/3e0df6e8-8809-4fdc-8a88-00e35926db24?reloadUri='+qendpoint.qlik_proxy_pt+'dev-hub/engine-api-explorer',
                      [],
                      {
                          'headers': {
                              'Cookie': 'X-Qlik-Session-Node='+data.token
                          }
                      }
                  );
          }
    

              ws.on('open', function open() {
                console.log('connection1 opened for sales performance with Session');
                  
                ws.send(JSON.stringify(opendocForLeaderboard));
              });

            ws.on('message', function(data, flags) {


                      
              var wsres = JSON.parse(data);
              console.log(wsres);
              if(wsres.params && wsres.params.logoutUri == qendpoint.ws_logout+'qps/user'){
                console.log('user is successfully logged in sales performance with session')
              }
              if(wsres.id==1){
                ws.send(JSON.stringify(getobjectForLeaderboard));
              }
              if(wsres.id==2){
                //console.log(wsres);
                ws.send(JSON.stringify(getlayoutForLeaderboard));
              }
              if(wsres.id==3){

                if (!wsres.result) {
                  return cb(null,leaderData);
                }
                
                var lbOpt = wsres.result.qLayout.qHyperCube.qGrandTotalRow;
                

                leaderData.performance =[];

                var billing ={};

                billing.FyYear = '2016';
                billing.Type = 'BILLING';
                billing.TargetValue = lbOpt[1].qText;
                billing.TargetValueRaw = lbOpt[1].qNum;
                billing.ActualValue = lbOpt[0].qText
                billing.ActualValueRaw = lbOpt[0].qNum;
                billing.PercentageAcheived = lbOpt[2].qText;
                billing.ActualDistributionList=[];

                leaderData.performance.push(billing);

                var booking ={};

                booking.FyYear = '2016';
                booking.Type = 'BOOKING';
                booking.TargetValue = lbOpt[4].qText;
                booking.TargetValueRaw = lbOpt[4].qNum;
                booking.ActualValue = lbOpt[3].qText
                booking.ActualValueRaw = lbOpt[3].qNum;
                booking.PercentageAcheived = lbOpt[5].qText;
                booking.ActualDistributionList=[];

                leaderData.performance.push(booking);
                

                ws.send(JSON.stringify(gethypercubeForLeaderboard));
   
                
                
              }
              if(wsres.id==4){

                for(var i=0;i<wsres.result.qDataPages[0].qMatrix.length;i++){
                   
                   var bookingServiceLine = {};
                   var billingServiceLine ={};

                   billingServiceLine.ServiceLineName = wsres.result.qDataPages[0].qMatrix[i][1].qText;
                   billingServiceLine.ActualValue = wsres.result.qDataPages[0].qMatrix[i][2].qText;
                   billingServiceLine.ActualValueRaw = wsres.result.qDataPages[0].qMatrix[i][2].qNum;
                   bookingServiceLine.ServiceLineName = wsres.result.qDataPages[0].qMatrix[i][1].qText;
                   bookingServiceLine.ActualValue = wsres.result.qDataPages[0].qMatrix[i][5].qText;
                   bookingServiceLine.ActualValueRaw = wsres.result.qDataPages[0].qMatrix[i][5].qNum;

                   leaderData.performance[0].ActualDistributionList.push(billingServiceLine)
                   leaderData.performance[1].ActualDistributionList.push(bookingServiceLine)
                  
                  
                }
                ws.send(JSON.stringify(getobjectForLeaderboardPipeline));
                
              }

              if(wsres.id==5){
                ws.send(JSON.stringify(getlayoutForLeaderboardPipeline));
              }
              
              if(wsres.id==6){

                
                var lbPip = wsres.result.qLayout.qHyperCube.qGrandTotalRow;

                leaderData.FunnelSummary={};
                leaderData.FunnelSummary.TQFValue=lbPip[1].qText;
                leaderData.FunnelSummary.TQFRaw=lbPip[1].qNum;
                leaderData.FunnelSummary.UQFValue=lbPip[2].qText;
                leaderData.FunnelSummary.UQFRaw=lbPip[2].qNum;
                leaderData.FunnelSummary.WinRate=lbPip[3].qText;
                leaderData.FunnelSummary.FunnelSufficiency=lbPip[7].qText;
                leaderData.FunnelSummary.FunnelSufficiencyValue=lbPip[6].qText;

                ws.send(JSON.stringify(getobjectForBillingFocusLeader));


                

              }

              if(wsres.id==7){

                ws.send(JSON.stringify(gethypercubeForBillingingFocusLeader));

              }
              if(wsres.id==8){
                for(var i=0;i<wsres.result.qDataPages[0].qMatrix.length;i++){
                   
                   

                   var billingFocusAccount = {};
        
                  

                   billingFocusAccount.Type = 'BILLING';
                   billingFocusAccount.AccountName = wsres.result.qDataPages[0].qMatrix[i][0].qText;
                   billingFocusAccount.ActualValue = wsres.result.qDataPages[0].qMatrix[i][1].qText;
                   billingFocusAccount.ActualValueRaw = wsres.result.qDataPages[0].qMatrix[i][1].qNum;
                   
                   leaderData.FocusAccounts.push(billingFocusAccount)
                   
                  
                  
                }
                ws.send(JSON.stringify(getobjectForBookingFocusLeader));
              
              }
              if(wsres.id==9){

                ws.send(JSON.stringify(gethypercubeForBookingFocusLeader));
                
              }
              if(wsres.id==10){
                for(var i=0;i<wsres.result.qDataPages[0].qMatrix.length;i++){
                  var bookingFocusAccount = {};
        
                   bookingFocusAccount.Type = 'BOOKING';
                   bookingFocusAccount.AccountName = wsres.result.qDataPages[0].qMatrix[i][0].qText;
                   bookingFocusAccount.ActualValue = wsres.result.qDataPages[0].qMatrix[i][1].qText;
                   bookingFocusAccount.ActualValueRaw = wsres.result.qDataPages[0].qMatrix[i][1].qNum;
                   
                   leaderData.FocusAccounts.push(bookingFocusAccount)
                   
                  
                  
                }
                ws.send(JSON.stringify(getobjectForPipelineFocusLeader));
              
              }
              if(wsres.id==11){

                ws.send(JSON.stringify(gethypercubeForPipelineFocusLeader));
                
              }
              if(wsres.id==12){
                for(var i=0;i<wsres.result.qDataPages[0].qMatrix.length;i++){
                  var pipelineFocusAccount = {};
        
                   pipelineFocusAccount.Type = 'PIPELINE';
                   pipelineFocusAccount.AccountName = wsres.result.qDataPages[0].qMatrix[i][0].qText;
                   pipelineFocusAccount.ActualValue = wsres.result.qDataPages[0].qMatrix[i][1].qText;
                   pipelineFocusAccount.ActualValueRaw = wsres.result.qDataPages[0].qMatrix[i][1].qNum;
                   
                   leaderData.FocusAccounts.push(pipelineFocusAccount);
                   

                  }
                  ws.send(JSON.stringify(getobjectForBookingOppurtunityLeader));
                
              }
              if(wsres.id==13){
                ws.send(JSON.stringify(gethypercubeForBookingOppurtunityLeader));
                
              }
              if(wsres.id==14){

                for(var i=0;i<wsres.result.qDataPages[0].qMatrix.length;i++){
                  var bookingOppurtunities = {};
                   

                   bookingOppurtunities.Type = 'BOOKING';
                   bookingOppurtunities.OpportunityName = wsres.result.qDataPages[0].qMatrix[i][2].qText;
                   bookingOppurtunities.Owner = wsres.result.qDataPages[0].qMatrix[i][0].qText;
                   bookingOppurtunities.Value = wsres.result.qDataPages[0].qMatrix[i][5].qText;
                   bookingOppurtunities.ValueRaw = wsres.result.qDataPages[0].qMatrix[i][5].qNum;
                   bookingOppurtunities.Stage = wsres.result.qDataPages[0].qMatrix[i][4].qText;
                   bookingOppurtunities.ClosingDate = wsres.result.qDataPages[0].qMatrix[i][3].qText;
                   
                   leaderData.TopOpportunityList.push(bookingOppurtunities);
                   

                  }
                  ws.send(JSON.stringify(getobjectForPipelineOppurtunityLeader));
                
              }
              if(wsres.id==15){
                ws.send(JSON.stringify(gethypercubeForPipelineOppurtunityLeader));
                
              }
              if(wsres.id==16){
                for(var i=0;i<wsres.result.qDataPages[0].qMatrix.length;i++){
                  var pipelineOppurtunities = {};
                   

                   pipelineOppurtunities.Type = 'PIPELINE';
                   pipelineOppurtunities.OpportunityName = wsres.result.qDataPages[0].qMatrix[i][2].qText;
                   pipelineOppurtunities.Owner = wsres.result.qDataPages[0].qMatrix[i][0].qText;
                   pipelineOppurtunities.Value = wsres.result.qDataPages[0].qMatrix[i][5].qText;
                   pipelineOppurtunities.ValueRaw = wsres.result.qDataPages[0].qMatrix[i][5].qNum;
                   pipelineOppurtunities.Stage = wsres.result.qDataPages[0].qMatrix[i][4].qText;
                   pipelineOppurtunities.ClosingDate = wsres.result.qDataPages[0].qMatrix[i][3].qText;
                   
                   console.log(leaderData.TopOpportunityList);
                   
                   leaderData.TopOpportunityList.push(pipelineOppurtunities);

                   
                  }

                cb(null,leaderData);
                leaderData=[];
                //return;
                console.log('Leaderboard data from sesssion',leaderData);
                
              }
            });

  
  },

  extractCardData: function(data,cb) {
   
  }

  
};
module.exports = qlik;