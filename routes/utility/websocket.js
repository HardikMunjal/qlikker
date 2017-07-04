'use strict';


var qlikauth = require('../qlik-auth');
var request = require('request');
var ejs = require('ejs');
var fs = require('fs');
var WebSocket = require('ws');
var qendpoint = require('../../config/endpoint');
var s_object = require('../../config/symphony_object');
var m_object = require('../../config/merlin_object');
var e_function = require('../../config/engine_funct');


//************************************ BUSINESS INSIGHTS DATA SERVICE ***************************************************

//************************************ NEW BUSINESS INSIGHTS DATA SERVICE ***************************************************
var openNewDoc= {"method":"OpenDoc","params":["314889d1-1873-423f-8f6c-57b854f599fb","","","",false],"handle":-1,"id":1,"jsonrpc":"2.0"}
var getNewObject= {"method":"GetObject","handle":1,"params":["TyjHp"],"id":2,"jsonrpc":"2.0"};
var getNewHypercube = {"method":"GetHyperCubeData","handle":2,"params":["/qHyperCubeDef",[
{"qTop":0,"qLeft":0,"qHeight":12,"qWidth":9}
]],"id":3,"jsonrpc":"2.0"}


//***************************************Symphony Test DATA SERVICE *******************************************************
var opendocSymphony= {"method":"OpenDoc","params":["314889d1-1873-423f-8f6c-57b854f599fb","","","",false],"handle":-1,"id":101,"jsonrpc":"2.0"}
var getobjectSymphony= {"method":"GetObject","handle":1,"params":["TqWcn"],"id":102,"jsonrpc":"2.0"};
var gethypercubeSymphony = {
  "method": "GetHyperCubePivotData",
  "handle": 2,
  "params": [
  "/qHyperCubeDef",
  [
  {
    "qTop": 0,
    "qLeft": 0,
    "qHeight": 200,
    "qWidth": 200
  }
  ]
  ],
  "id": 103,
  "jsonrpc": "2.0",
  "outKey": -1
}

//***************************************LEADERBOARD DATA SERVICE *******************************************************
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

var getobjectForPipelineFocusLeader= {"method":"GetObject","handle":1,"params":["QxShXAr"],"id":11,"jsonrpc":"2.0"};
var gethypercubeForPipelineFocusLeader = {"method":"GetHyperCubeData","handle":6,"params":["/qHyperCubeDef",[
{"qTop":0,"qLeft":0,"qHeight":10,"qWidth":4}
]],"id":12,"jsonrpc":"2.0"}


var getobjectForBookingOppurtunityLeader= {"method":"GetObject","handle":1,"params":["tQujdg"],"id":13,"jsonrpc":"2.0"};
var gethypercubeForBookingOppurtunityLeader = {"method":"GetHyperCubeData","handle":7,"params":["/qHyperCubeDef",[
{"qTop":0,"qLeft":0,"qHeight":10,"qWidth":7}
]],"id":14,"jsonrpc":"2.0"}

var getobjectForPipelineOppurtunityLeader= {"method":"GetObject","handle":1,"params":["PAEwpnZ"],"id":15,"jsonrpc":"2.0"};
var gethypercubeForPipelineOppurtunityLeader = {"method":"GetHyperCubeData","handle":8,"params":["/qHyperCubeDef",[
{"qTop":0,"qLeft":0,"qHeight":10,"qWidth":7}
]],"id":16,"jsonrpc":"2.0"}



//***************************** LEADERBOARD DEEP DIVE DATA SERVICE ************************************

var oppurtunityDeepdiveObject= {"method":"GetObject","handle":1,"params":["nkTtGQ"],"id":17,"jsonrpc":"2.0"};
var oppurtunityDeepdiveHypercube = {"method":"GetHyperCubeData","handle":2,"params":["/qHyperCubeDef",[
{"qTop":0,"qLeft":0,"qHeight":120,"qWidth":7}
]],"id":18,"jsonrpc":"2.0"}


var FunnelTeamObject = {
  "method": "GetObject",
  "handle": 1,
  "params": [
  "aDnTrpX"
  ],
  "id": 19,
  "jsonrpc": "2.0",
  "outKey": -1
}
var FunnelTeamHypercubePivot = {
  "method": "GetHyperCubePivotData",
  "handle": 3,
  "params": [
  "/qHyperCubeDef",
  [
  {
    "qTop": 0,
    "qLeft": 0,
    "qHeight": 20,
    "qWidth": 30
  }
  ]
  ],
  "id": 20,
  "jsonrpc": "2.0",
  "outKey": -1
}

var Focus150Object = {
  "method": "GetObject",
  "handle": 1,
  "params": [
  "fFRJAQ"
  ],
  "id": 21,
  "jsonrpc": "2.0",
  "outKey": -1
}
var Focus150HypercubePivot = {
  "method": "GetHyperCubePivotData",
  "handle": 4,
  "params": [
  "/qHyperCubeDef",
  [
  {
    "qTop": 0,
    "qLeft": 0,
    "qHeight": 155,
    "qWidth": 155
  }
  ]
  ],
  "id": 22,
  "jsonrpc": "2.0",
  "outKey": -1
}

var getObjectLeaderboardBooking = {
  "method": "GetObject",
  "handle": 1,
  "params": [
  "tjuJQR"
  ],
  "id": 23,
  "jsonrpc": "2.0",
  "outKey": -1
}
var getHypercubePivotLeaderboardBooking = {
  "method": "GetHyperCubePivotData",
  "handle": 5,
  "params": [
  "/qHyperCubeDef",
  [
  {
    "qTop": 0,
    "qLeft": 0,
    "qHeight": 155,
    "qWidth": 155
  }
  ]
  ],
  "id": 24,
  "jsonrpc": "2.0",
  "outKey": -1
}

var getObjectBookingTeam = {
  "method": "GetObject",
  "handle": 1,
  "params": [
  "bQdtsmf"
  ],
  "id": 25,
  "jsonrpc": "2.0",
  "outKey": -1
}
var getHypercubePivotBookingTeam = {
  "method": "GetHyperCubePivotData",
  "handle": 6,
  "params": [
  "/qHyperCubeDef",
  [
  {
    "qTop": 0,
    "qLeft": 0,
    "qHeight": 155,
    "qWidth": 155
  }
  ]
  ],
  "id": 26,
  "jsonrpc": "2.0",
  "outKey": -1
}


var getobjectForBookingOppurtunity= {"method":"GetObject","handle":1,"params":["EsKpf"],"id":27,"jsonrpc":"2.0"};
var gethypercubeForBookingOppurtunity = {"method":"GetHyperCubeData","handle":7,"params":["/qHyperCubeDef",[
{"qTop":0,"qLeft":0,"qHeight":150,"qWidth":10}
]],"id":28,"jsonrpc":"2.0"}


var getobjectForWINSTeam= {"method":"GetObject","handle":1,"params":["PdCjsJY"],"id":29,"jsonrpc":"2.0"};
var gethypercubeForWINSTeam = {"method":"GetHyperCubeData","handle":8,"params":["/qHyperCubeDef",[
{"qTop":0,"qLeft":0,"qHeight":100,"qWidth":100}
]],"id":30,"jsonrpc":"2.0"}


var businessInsights = [];



var qlik = {


  extractBusinessInsightsData: function(data,cb) {

//console.log(data);

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

var opendocSalesBI = e_function.opendoc(1,-1,'83dc76e7-6d76-455f-9052-e71da06a5c93');
ws.on('open', function open() {
  ws.send(JSON.stringify(opendocSalesBI));
});

ws.on('message', function(data, flags) {

  var wsres = JSON.parse(data);
  if(wsres.params && wsres.params.logoutUri == qendpoint.ws_logout+'qps/user'){
          //console.log('user is successfully logged in sales performance with session')
        }
        if(wsres.id==1){
          var handle = wsres.result.qReturn.qHandle;
          var getobjectSalesBI = e_function.getobject(2,handle,"wJscr");
          ws.send(JSON.stringify(getobjectSalesBI));
        }
        if(wsres.id==2){
          console.log(wsres)
          var handle = wsres.result.qReturn.qHandle;
          var rows_height = 12;
          var cloumns_width = 9;
          var gethypercubeSalesBI = e_function.gethypercube(3,handle,rows_height,cloumns_width);
          ws.send(JSON.stringify(gethypercubeSalesBI));
        }
        if(wsres.id==3){

          if (!wsres.result) {
                  //console.log('no records');
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
             }
           });


},

extractNewBIData: function(data,cb) {


  if(data.target=='TICKET'){

    var ws = new WebSocket(
      qendpoint.qlik_ws+'app/314889d1-1873-423f-8f6c-57b854f599fb?reloadUri='+qendpoint.qlik_proxy_pt+'dev-hub/engine-api-explorer&QlikTicket='+data.token
      );

  }
  else if(data.target=='SESSION'){

    var ws = new WebSocket(
      qendpoint.qlik_ws+'app/314889d1-1873-423f-8f6c-57b854f599fb?reloadUri='+qendpoint.qlik_proxy_pt+'dev-hub/engine-api-explorer',
      [],
      {
        'headers': {
          'Cookie': 'X-Qlik-Session-Node='+data.token
        }
      }
      );
  }


  ws.on('open', function open() {
    ws.send(JSON.stringify(openNewDoc));
  });

  ws.on('message', function(data, flags) {

    var wsres = JSON.parse(data);
    if(wsres.params && wsres.params.logoutUri == qendpoint.ws_logout+'qps/user'){
      //console.log('user is successfully logged in sales performance with session')
    }
    if(wsres.id==1){
      ws.send(JSON.stringify(getNewObject));
    }
    if(wsres.id==2){
      ws.send(JSON.stringify(getNewHypercube));
    }
    if(wsres.id==3){

      if (!wsres.result) {
                  //console.log('no records');
                  var biarray = {};
                  biarray.biNo = null;
                  biarray.category = null;
                  biarray.underlying_logic = null;
                  biarray.insight_title = null;
                  biarray.url = null;
                  biarray.count = null;
                  businessInsights.push(biarray);
                  biarray={};
                  cb(null,businessInsights);
                  businessInsights=[];
                  return;
                }

                for(var i=0;i<wsres.result.qDataPages[0].qMatrix.length;i++){
                 console.log(wsres.result.qDataPages[0].qMatrix[i][6].qText)
                 var biarray = {};
                 biarray.biNo = wsres.result.qDataPages[0].qMatrix[i][0].qText;
                 biarray.category = wsres.result.qDataPages[0].qMatrix[i][2].qText;
                 biarray.underlying_logic = wsres.result.qDataPages[0].qMatrix[i][3].qText;
                 biarray.insight_title = wsres.result.qDataPages[0].qMatrix[i][4].qText;
                 biarray.url = wsres.result.qDataPages[0].qMatrix[i][5].qText;
                 biarray.count = wsres.result.qDataPages[0].qMatrix[i][6].qText;
                 businessInsights.push(biarray);
                 biarray={};
               }
               cb(null,businessInsights);
               businessInsights=[];
                //console.log('Performance Business insights from sesssion');
                
              }
            });


},

extractLeaderData: function(data,cb) {

      //console.log(data);
      var leaderData = {};
      leaderData.error_id = 0;
      leaderData.error_message ='Success'
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
                //console.log('connection1 opened for sales performance with Session');

                ws.send(JSON.stringify(opendocForLeaderboard));
              });

      ws.on('message', function(data, flags) {



        var wsres = JSON.parse(data);
              //console.log(wsres);
              if(wsres.params && wsres.params.logoutUri == qendpoint.ws_logout+'qps/user'){
                //console.log('user is successfully logged in sales performance with session')
              }
              if(wsres.id==1){

                if(wsres.error && wsres.error.code==403){
                  var e={};
                  var emessage = {};
                  emessage.error_id = 403;
                  emessage.error_message ='You do not have leaderboard access';
                  e.status = 403;
                  e.message = emessage;
                  
                  
                  return cb(e)
                }
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
              leaderData.FunnelSummary.AsOnDate=lbPip[8].qText

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
              bookingOppurtunities.Value = wsres.result.qDataPages[0].qMatrix[i][6].qText;
              bookingOppurtunities.ValueRaw = wsres.result.qDataPages[0].qMatrix[i][6].qNum;
              bookingOppurtunities.Stage = wsres.result.qDataPages[0].qMatrix[i][4].qText;
              bookingOppurtunities.ClosingDate = wsres.result.qDataPages[0].qMatrix[i][3].qText;
              bookingOppurtunities.AccountGroup = wsres.result.qDataPages[0].qMatrix[i][5].qText;

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
              pipelineOppurtunities.Value = wsres.result.qDataPages[0].qMatrix[i][6].qText;
              pipelineOppurtunities.ValueRaw = wsres.result.qDataPages[0].qMatrix[i][6].qNum;
              pipelineOppurtunities.Stage = wsres.result.qDataPages[0].qMatrix[i][4].qText;
              pipelineOppurtunities.ClosingDate = wsres.result.qDataPages[0].qMatrix[i][3].qText;
              pipelineOppurtunities.AccountGroup = wsres.result.qDataPages[0].qMatrix[i][5].qText;

                   //console.log(leaderData.TopOpportunityList);
                   
                   leaderData.TopOpportunityList.push(pipelineOppurtunities);

                   
                 }

                 cb(null,leaderData);
                 leaderData=[];
                //return;
                //console.log('Leaderboard data from sesssion',leaderData);
                
              }
            });


},

extractLeaderDeepdive: function(data,cb) {


  var leaderDeepDiveData = {};
  leaderDeepDiveData.error_id = 0;
  leaderDeepDiveData.error_message ='Success'
  leaderDeepDiveData.Funnel ={};
      //leaderDeepDiveData.Funnel.AsOnDate = '2017'
      leaderDeepDiveData.Funnel.FunnelSummary=[];
      leaderDeepDiveData.Funnel.FunnelSummaryTeam=[];
      leaderDeepDiveData.Funnel.TopAccounts=[];
      leaderDeepDiveData.Funnel.OpportunityListTeam=[];

      
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

        ws.send(JSON.stringify(opendocForLeaderboard));
      });

      ws.on('message', function(data, flags) {

        var wsres = JSON.parse(data);

        if(wsres.params && wsres.params.logoutUri == qendpoint.ws_logout+'qps/user'){
        }
        if(wsres.id==1){

          if(wsres.error && wsres.error.code==403){
            var e={};
            var emessage = {};
            emessage.error_id = 403;
            emessage.error_message ='You do not have leaderboard access';
            e.status = 403;
            e.message = emessage;


            return cb(e)
          }
          ws.send(JSON.stringify(oppurtunityDeepdiveObject));
        }
        if(wsres.id==17){
                //console.log(wsres);
                ws.send(JSON.stringify(oppurtunityDeepdiveHypercube));
              }
              if(wsres.id==18){

                if (!wsres.result) {
                  return cb(null,leaderData);
                }
                
                


                for(var i=0;i<wsres.result.qDataPages[0].qMatrix.length;i++){
                  var funnel = {};


                  funnel.Stage = wsres.result.qDataPages[0].qMatrix[i][0].qText;
                  funnel.BType = wsres.result.qDataPages[0].qMatrix[i][1].qText;
                  funnel.ActualValue = wsres.result.qDataPages[0].qMatrix[i][3].qText;
                  funnel.Type = wsres.result.qDataPages[0].qMatrix[i][2].qText;
                  funnel.OCount = wsres.result.qDataPages[0].qMatrix[i][4].qText;



                  leaderDeepDiveData.Funnel.FunnelSummary.push(funnel);

                }
                ws.send(JSON.stringify(FunnelTeamObject));
                //cb(null,leaderDeepDiveData);

              }

              if(wsres.id==19){
                //console.log(wsres);
                ws.send(JSON.stringify(FunnelTeamHypercubePivot));
              }
              if(wsres.id==20){

                if (!wsres.result) {
                  return cb(null,leaderData);
                }
                
                


                for(var i=1;i<wsres.result.qDataPages[0].qLeft.length;i++){
                  var funnelTeam = {};


                  funnelTeam.EName = wsres.result.qDataPages[0].qLeft[i].qText;
                  funnelTeam.TQF = wsres.result.qDataPages[0].qData[i][0].qText;
                  funnelTeam.OCount = wsres.result.qDataPages[0].qData[i][1].qNum;
                  funnelTeam.WinRate = wsres.result.qDataPages[0].qData[i][2].qText;
                  funnelTeam.FSKey = wsres.result.qDataPages[0].qData[i][3].qText;
                  funnelTeam.FSValue = wsres.result.qDataPages[0].qData[i][4].qText;

                  funnelTeam.FunnelList =[];

                  var stage={};

                  stage.Type = 'NF'
                  stage.FValue = wsres.result.qDataPages[0].qData[i][19].qText
                  stage.FCount = wsres.result.qDataPages[0].qData[i][13].qText;
                  stage.BType = 'EE';
                  funnelTeam.FunnelList.push(stage);
                  stage={};

                  stage.Type = 'NF'
                  stage.FValue = wsres.result.qDataPages[0].qData[i][20].qText
                  stage.FCount = wsres.result.qDataPages[0].qData[i][14].qText;
                  stage.BType = 'EN';
                  funnelTeam.FunnelList.push(stage);
                  stage={};


                  stage.Type = 'NF'
                  stage.FValue = wsres.result.qDataPages[0].qData[i][21].qText
                  stage.FCount = wsres.result.qDataPages[0].qData[i][15].qText;
                  stage.BType = 'NN';
                  funnelTeam.FunnelList.push(stage);
                  stage={};

                  stage.Type = 'CF'
                  stage.FValue = wsres.result.qDataPages[0].qData[i][22].qText
                  stage.FCount = wsres.result.qDataPages[0].qData[i][16].qText;
                  stage.BType = 'EE';
                  funnelTeam.FunnelList.push(stage);
                  stage={};

                  stage.Type = 'CF'
                  stage.FValue = wsres.result.qDataPages[0].qData[i][23].qText
                  stage.FCount = wsres.result.qDataPages[0].qData[i][17].qText;
                  stage.BType = 'EN';
                  funnelTeam.FunnelList.push(stage);
                  stage={};


                  stage.Type = 'CF'
                  stage.FValue = wsres.result.qDataPages[0].qData[i][24].qText
                  stage.FCount = wsres.result.qDataPages[0].qData[i][18].qText;
                  stage.BType = 'NN';
                  funnelTeam.FunnelList.push(stage);
                  stage={};




                  leaderDeepDiveData.Funnel.FunnelSummaryTeam.push(funnelTeam);


                  var opportunity={};
                  opportunity.EName = wsres.result.qDataPages[0].qLeft[i].qText;

                  opportunity.DataList =[];

                  var stage={};

                  stage.OCount = wsres.result.qDataPages[0].qData[i][6].qText
                  stage.TypeText = 'L3'
                  stage.RawValue = wsres.result.qDataPages[0].qData[i][5].qText;
                  opportunity.DataList.push(stage);
                  stage={};

                  stage.OCount = wsres.result.qDataPages[0].qData[i][8].qText
                  stage.TypeText = 'L2'
                  stage.RawValue = wsres.result.qDataPages[0].qData[i][7].qText;
                  opportunity.DataList.push(stage);
                  stage={};

                  stage.OCount = wsres.result.qDataPages[0].qData[i][10].qText
                  stage.TypeText = 'L1'
                  stage.RawValue = wsres.result.qDataPages[0].qData[i][9].qText;
                  opportunity.DataList.push(stage);
                  stage={};

                  leaderDeepDiveData.Funnel.OpportunityListTeam.push(opportunity)

                }
                ws.send(JSON.stringify(Focus150Object));

              }


              if(wsres.id==21){
                //console.log(wsres);
                ws.send(JSON.stringify(Focus150HypercubePivot));
              }
              if(wsres.id==22){

                if (!wsres.result) {
                  return cb(null,leaderData);
                }
                
                


                for(var i=0;i<wsres.result.qDataPages[0].qLeft.length;i++){
                  var TAccounts = {};


                  TAccounts.AccGroup = wsres.result.qDataPages[0].qLeft[i].qText;
                  TAccounts.AccValue = wsres.result.qDataPages[0].qData[i][0].qText;
                  TAccounts.DataList =[];

                  var stage={};

                  stage.Type = 'L'
                  stage.TypeText = 'L3'
                  stage.RawValue = wsres.result.qDataPages[0].qData[i][1].qText;
                  TAccounts.DataList.push(stage);
                  stage={};

                  stage.Type = 'L'
                  stage.TypeText = 'L2'
                  stage.RawValue = wsres.result.qDataPages[0].qData[i][2].qText;
                  TAccounts.DataList.push(stage);
                  stage={};

                  stage.Type = 'L'
                  stage.TypeText = 'L1'
                  stage.RawValue = wsres.result.qDataPages[0].qData[i][3].qText;
                  TAccounts.DataList.push(stage);
                  stage={};

                  stage.Type = 'B'
                  stage.TypeText = 'EE'
                  stage.RawValue = wsres.result.qDataPages[0].qData[i][4].qText;
                  TAccounts.DataList.push(stage);
                  stage={};


                  stage.Type = 'B'
                  stage.TypeText = 'EN'
                  stage.RawValue = wsres.result.qDataPages[0].qData[i][5].qText;
                  TAccounts.DataList.push(stage);
                  stage={};

                  stage.Type = 'B'
                  stage.TypeText = 'NN'
                  stage.RawValue = wsres.result.qDataPages[0].qData[i][6].qText;
                  TAccounts.DataList.push(stage);
                  stage={};

                  stage.Type = 'S'
                  stage.TypeText = 'INFRA'
                  stage.RawValue = wsres.result.qDataPages[0].qData[i][7].qText;
                  TAccounts.DataList.push(stage);
                  stage={};

                  stage.Type = 'S'
                  stage.TypeText = 'ERS'
                  stage.RawValue = wsres.result.qDataPages[0].qData[i][8].qText;
                  TAccounts.DataList.push(stage);
                  stage={};

                  stage.Type = 'S'
                  stage.TypeText = 'BPO'
                  stage.RawValue = wsres.result.qDataPages[0].qData[i][9].qText;
                  TAccounts.DataList.push(stage);
                  stage={};

                  stage.Type = 'S'
                  stage.TypeText = 'APPS'
                  stage.RawValue = wsres.result.qDataPages[0].qData[i][10].qText;
                  TAccounts.DataList.push(stage);
                  stage={};







                  leaderDeepDiveData.Funnel.TopAccounts.push(TAccounts);

                }
                //return cb(null,leaderDeepDiveData);
                ws.send(JSON.stringify(getObjectLeaderboardBooking));

              }

              if(wsres.id==23){

                ws.send(JSON.stringify(getHypercubePivotLeaderboardBooking));
              }
              if(wsres.id==24){

                console.log(wsres.result)
                if (!wsres.result) {
                  return cb(null,leaderData);
                }

                //leaderDeepDiveData={};
                leaderDeepDiveData.Booking={};
                leaderDeepDiveData.Booking.Performance=[];
                var counter =0;
                for(var i=1;i<wsres.result.qDataPages[0].qData.length;i++){

                  if((i%4)!= 0){

                    if(i<5){
                      var j=i; 
                    }else{
                      var j= i-(4*counter);
                    }

                    var performance={};
                    performance.BType= wsres.result.qDataPages[0].qLeft[0].qSubNodes[j].qText;

                    if(counter<4){
                      performance.Quarter= wsres.result.qDataPages[0].qLeft[counter].qText.substring(0,3);
                    }
                    performance.Actual= wsres.result.qDataPages[0].qData[i][0].qText;
                    performance.Target= wsres.result.qDataPages[0].qData[i][4].qText;
                    performance.TargetorActual = wsres.result.qDataPages[0].qData[i][10].qText;

                    performance.DList=[];

                    for(var m=0;m<4;m++){
                      var serviceLine={};

                      serviceLine.SLine= wsres.result.qDataPages[0].qTop[6+m].qText;
                      serviceLine.Value= wsres.result.qDataPages[0].qData[i][6+m].qText;
                      performance.DList.push(serviceLine);
                    }

                    leaderDeepDiveData.Booking.Performance.push(performance);
                  }
                  else if((i%4)== 0){
                    counter=counter+1;
                  }
                  

                }
                //return cb(null,leaderDeepDiveData);
                ws.send(JSON.stringify(getObjectBookingTeam));

              }

              if(wsres.id==25){

                ws.send(JSON.stringify(getHypercubePivotBookingTeam));
              }
              if(wsres.id==26){


                if (!wsres.result) {
                  return cb(null,leaderData);
                }

                //leaderDeepDiveData={};
                leaderDeepDiveData.Booking.PerformanceTeam=[];
                var j=0;

                var counter =1;
                for(var i=0;i<wsres.result.qDataPages[0].qData.length;i++){

//Remove l with i , no use of l
                  var k= i;
                  var l= i;
                  if(i<90){
                    var member={};
                    var bilinker=1;

                    for(i;i<k+3;i++){

                      for(counter=1;counter< wsres.result.qDataPages[0].qLeft[j].qSubNodes.length;counter++){
                        member.MemberName = wsres.result.qDataPages[0].qLeft[j].qText;

                        if(bilinker<5){
                          member.BType = wsres.result.qDataPages[0].qTop[0].qSubNodes[bilinker].qText
                        }

                        member.Actual = wsres.result.qDataPages[0].qData[l+counter][bilinker].qText
                        member.Target = wsres.result.qDataPages[0].qData[l+counter][bilinker+4].qText
                        member.TargetorActual = wsres.result.qDataPages[0].qData[l+counter][bilinker+28].qText
                        console.log(l,counter,member.Actual)
                        member.Quarter = wsres.result.qDataPages[0].qLeft[j].qSubNodes[counter].qText.substring(0,3);
                        member.Dlist=[];
                        var serviceLine = {};
                        serviceLine.SLine = 'APPS'
                        serviceLine.ActualValue = wsres.result.qDataPages[0].qData[l+counter][bilinker+12].qText
                        member.Dlist.push(serviceLine);
                        serviceLine = {};

                        serviceLine.SLine = 'BPO'
                        serviceLine.ActualValue = wsres.result.qDataPages[0].qData[l+counter][bilinker+16].qText
                        member.Dlist.push(serviceLine);
                        serviceLine = {};

                        serviceLine.SLine = 'ERS'
                        serviceLine.ActualValue = wsres.result.qDataPages[0].qData[l+counter][bilinker+20].qText
                        member.Dlist.push(serviceLine);
                        serviceLine = {};

                        serviceLine.SLine = 'INFRA'
                        serviceLine.ActualValue = wsres.result.qDataPages[0].qData[l+counter][bilinker+24].qText
                        member.Dlist.push(serviceLine);
                        serviceLine = {};




                        leaderDeepDiveData.Booking.PerformanceTeam.push(member);
                        member={};

                      }
                      bilinker=bilinker+1;
                    }


                    j=j+1;
                    i=i+1;
                  
                  
                }

              }
              ws.send(JSON.stringify(getobjectForBookingOppurtunity));
                //return cb(null,leaderDeepDiveData);
                
              }
              if(wsres.id==27){

                ws.send(JSON.stringify(gethypercubeForBookingOppurtunity));

              }
              
              if(wsres.id==28){

                //leaderDeepDiveData={};
                leaderDeepDiveData.Booking.WINS=[];
                for(var i=0;i<wsres.result.qDataPages[0].qMatrix.length;i++){


                  var winarray = {};

                  winarray.BType = wsres.result.qDataPages[0].qMatrix[i][0].qText;
                  winarray.Quarter = wsres.result.qDataPages[0].qMatrix[i][4].qText.substring(0,3);
                  winarray.OValue = wsres.result.qDataPages[0].qMatrix[i][6].qText;
                  winarray.OName = wsres.result.qDataPages[0].qMatrix[i][2].qText;
                  winarray.AccountGroup = wsres.result.qDataPages[0].qMatrix[i][3].qText;

                  leaderDeepDiveData.Booking.WINS.push(winarray)
                  winarray={};



                } 
                ws.send(JSON.stringify(getobjectForWINSTeam));
                //return cb(null,leaderDeepDiveData);

              }
              if(wsres.id==29){

                ws.send(JSON.stringify(gethypercubeForWINSTeam));

              }
              
              if(wsres.id==30){

                //leaderDeepDiveData={};
                leaderDeepDiveData.Booking.WINTEAM=[];
                var length = wsres.result.qDataPages[0].qMatrix.length;

                var i = 0;

                while(i<length){
                  var DataList = []
                  var target = {};
                  var deal = {};
                  target.Membername = wsres.result.qDataPages[0].qMatrix[i][0].qText;
                  deal.DealType = wsres.result.qDataPages[0].qMatrix[i][1].qText;
                  deal.DealCount = wsres.result.qDataPages[0].qMatrix[i][2].qText;
                  deal.DealValue = wsres.result.qDataPages[0].qMatrix[i][3].qText;
                  DataList.push(deal);
                  target.DataList = DataList;
                  leaderDeepDiveData.Booking.WINTEAM.push(target);
                  var j = i;
                  if((length-i >= 2)&&(wsres.result.qDataPages[0].qMatrix[i][0].qText == wsres.result.qDataPages[0].qMatrix[i+1][0].qText)){
                    j = i+1;
                    var deal = {};
                    deal.DealType = wsres.result.qDataPages[0].qMatrix[j][1].qText;
                    deal.DealCount = wsres.result.qDataPages[0].qMatrix[j][2].qText;
                    deal.DealValue = wsres.result.qDataPages[0].qMatrix[j][3].qText;
                    leaderDeepDiveData.Booking.WINTEAM[leaderDeepDiveData.Booking.WINTEAM.length-1].DataList.push(deal);
                    if((length-i >= 3)&&(wsres.result.qDataPages[0].qMatrix[i][0].qText == wsres.result.qDataPages[0].qMatrix[i+2][0].qText)){
                      j = i+2;
                      var deal = {};
                      deal.DealType = wsres.result.qDataPages[0].qMatrix[j][1].qText;
                      deal.DealCount = wsres.result.qDataPages[0].qMatrix[j][2].qText;
                      deal.DealValue = wsres.result.qDataPages[0].qMatrix[j][3].qText;
                      leaderDeepDiveData.Booking.WINTEAM[leaderDeepDiveData.Booking.WINTEAM.length-1].DataList.push(deal);
                    }
                  }
                  i = j+1;
                }

                return cb(null,leaderDeepDiveData);

              }
              
              



            });
},

extractSymphonydata: function(data,cb) {

  console.log(data);

  if(data.target=='TICKET'){

    var ws = new WebSocket(
      qendpoint.qlik_ws+'app/314889d1-1873-423f-8f6c-57b854f599fb?reloadUri='+qendpoint.qlik_proxy_pt+'dev-hub/engine-api-explorer&QlikTicket='+data.token
      );

  }
  else if(data.target=='SESSION'){

    var ws = new WebSocket(
      qendpoint.qlik_ws+'app/314889d1-1873-423f-8f6c-57b854f599fb?reloadUri='+qendpoint.qlik_proxy_pt+'dev-hub/engine-api-explorer',
      [],
      {
        'headers': {
          'Cookie': 'X-Qlik-Session-Node='+data.token
        }
      }
      );
  }


  ws.on('open', function open() {
                //console.log('connection1 opened for sales performance with Session');

                ws.send(JSON.stringify(opendocSymphony));
              });

  ws.on('message', function(data, flags) {

    var wsres = JSON.parse(data);
    console.log(wsres);
    if(wsres.params && wsres.params.logoutUri == qendpoint.ws_logout+'qps/user'){
                //console.log('user is successfully logged in sales performance with session')
              }
              if(wsres.id==101){
                ws.send(JSON.stringify(getobjectSymphony));
              }
              if(wsres.id==102){
                //console.log(wsres);
                ws.send(JSON.stringify(gethypercubeSymphony));
              }
              if(wsres.id==103){

                if (!wsres.result) {
                  //console.log('no records');
                  
                  cb(null,{oops:'nodata'});
                  
                  return;
                }

                
                cb(null,wsres.result);
                
              }
            });

  
},

extractCardData: function(data,cb) {

}


};
module.exports = qlik;