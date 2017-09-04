'use strict';

var qlikauth = require('../../qlik-auth');
var request = require('request');
var ejs = require('ejs');
var fs = require('fs');
var WebSocket = require('ws');
var qendpoint = require('../../../config/endpoint');
var m_object = require('../../../config/merlin_object');
var e_function = require('../../../config/engine_funct');
var openDocHandle=-1;
var getObjectHandle=1;
var handle;
var BookingTeamData;

var businessInsights = [];

var qlik = {


extractBusinessInsightsData: function(data,cb) {

if(data.target=='TICKET'){

  var ws = new WebSocket(
    qendpoint.qlik_ws+'app/'+m_object.extractBusinessInsightsDataAppID+'?reloadUri='+qendpoint.qlik_proxy_pt+'dev-hub/engine-api-explorer&QlikTicket='+data.token
    );

}
else if(data.target=='SESSION'){

  var ws = new WebSocket(
    qendpoint.qlik_ws+'app/'+m_object.extractBusinessInsightsDataAppID+'?reloadUri='+qendpoint.qlik_proxy_pt+'dev-hub/engine-api-explorer',
    [],
    {
      'headers': {
        'Cookie': 'X-Qlik-Session-Node='+data.token
      }
    }
    );
}

var opendocSalesBI = e_function.opendoc(1,openDocHandle,m_object.extractBusinessInsightsDataAppID);
ws.on('open', function open() {
  ws.send(JSON.stringify(opendocSalesBI));
});

ws.on('message', function(data, flags) {

  var wsres = JSON.parse(data);
  if(wsres.params && wsres.params.logoutUri == qendpoint.ws_logout+'qps/user'){

          //console.log('user is successfully logged in sales performance with session')
        }
        if(wsres.id==1){
          if(wsres.error){
                  var e={};
                  var emessage = {};
                  emessage.error_id = 403;
                  emessage.error_message ='You do not have Sales access';
                  e.status = 403;
                  e.message = emessage;
                  
                  
                  return cb(e)
                }
          var getobjectSalesBI = e_function.getobject(2,getObjectHandle,m_object.extractBusinessInsightsObjID);
          ws.send(JSON.stringify(getobjectSalesBI));
        }
        if(wsres.id==2){
          //console.log(wsres)
          handle = wsres.result.qReturn.qHandle;
          var rows_height = 15;
          var cloumns_width =11;
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

               var date = new Date();
               console.log('Sales business insights ',date);
               cb(null,businessInsights);
               businessInsights=[];
             }
           });


},


extractSalesData: function(data,cb) {
var user_id= data.user_id;
var user_directory = data.user_directory;
var proxyUrl= 'http://10.2.5.158:4011/scr/ticket/user/'+user_directory+'/'+user_id+'?client_id=merlin&scope=ticket&open=';
if(data.target=='TICKET'){

  var ws = new WebSocket(
    qendpoint.qlik_ws+'app/'+m_object.extractBusinessInsightsDataAppID+'?reloadUri='+qendpoint.qlik_proxy_pt+'dev-hub/engine-api-explorer&QlikTicket='+data.token
    );

}
else if(data.target=='SESSION'){

  var ws = new WebSocket(
    qendpoint.qlik_ws+'app/'+m_object.extractBusinessInsightsDataAppID+'?reloadUri='+qendpoint.qlik_proxy_pt+'dev-hub/engine-api-explorer',
    [],
    {
      'headers': {
        'Cookie': 'X-Qlik-Session-Node='+data.token
      }
    }
    );
}

var opendocSalesBI = e_function.opendoc(1,openDocHandle,m_object.extractBusinessInsightsDataAppID);
ws.on('open', function open() {
  ws.send(JSON.stringify(opendocSalesBI));
});

ws.on('message', function(data, flags) {

  var wsres = JSON.parse(data);
  console.log(wsres);
  if(wsres.params && wsres.params.logoutUri == qendpoint.ws_logout+'qps/user'){

          //console.log('user is successfully logged in sales performance with session')
        }
        if(wsres.id==1){
          if(wsres.error){
                  var e={};
                  var emessage = {};
                  emessage.error_id = 403;
                  emessage.error_message ='You do not have Sales access';
                  e.status = 403;
                  e.message = emessage;
                  
                  
                  return cb(e)
                }

                ws.send(JSON.stringify(e_function.clearFilter()));
                
          
        }
        if(wsres.id==501){
                var getobjectSalesBI = e_function.getobject(2,getObjectHandle,m_object.extractBusinessInsightsObjID);
                ws.send(JSON.stringify(getobjectSalesBI));
        } 
        if(wsres.id==2){
          //console.log(wsres)
          handle = wsres.result.qReturn.qHandle;
          var rows_height = 15;
          var cloumns_width =11;
          var businessInsightCount = 6;
          var gethypercubeSalesBI = e_function.gethypercube(3,handle,rows_height,cloumns_width);
          ws.send(JSON.stringify(gethypercubeSalesBI));
        }
        if(wsres.id==3){
          if (!wsres.result) {
                  //console.log('no records');
                  var salesData={};

                  salesData.TQFValue = null;
                  salesData.TQFPercentage = null;
                  
                  salesData.UQFValue = null;
                  
                  salesData.UQFPercentage = null; 
                  salesData.WINRate = null;
                  salesData.FYDate = null;
                  salesData.FSValue= null;
                  salesData.FSColor= null;
                  salesData.FSKey= null;
                  salesData.PipelineLastReload= null;
                  salesData.BillingURL=null;
                  salesData.BookingURL=null;
                  salesData.PipeLineURL=null;
                  salesData.QlikInsightData=[];

                 
                  cb(null,businessInsights);
                  businessInsights=[];
                  return;
                }

                var businessInsightsArray=[];
                var salesData={};

               
                for(var i=0;i<wsres.result.qDataPages[0].qMatrix.length;i++){
                  
                  //console.log(businessInsightsArray)
                  if(wsres.result.qDataPages[0].qMatrix[i][0].qText<6){
                     var biarray = {};
                     //biarray.index = wsres.result.qDataPages[0].qMatrix[i][1].qText;
                     biarray.BICondition = wsres.result.qDataPages[0].qMatrix[i][2].qText ||'-';
                     biarray.BIUrl = proxyUrl+wsres.result.qDataPages[0].qMatrix[i][10].qText ||'-';
                     biarray.BItitle = wsres.result.qDataPages[0].qMatrix[i][4].qText ||'-';
                     biarray.IsDataModified = null;
                     biarray.ItemValue1 = wsres.result.qDataPages[0].qMatrix[i][7].qText ||'-';
                     biarray.ItemValue2 = wsres.result.qDataPages[0].qMatrix[i][8].qText ||'-';


                     
                     if(biarray.ItemValue1!='-'){
                     biarray.ItemKey1 = wsres.result.qDataPages[0].qMatrix[i][5].qText ||'-';
                     }else{
                      
                      biarray.ItemKey1='-'
                     }

                     if(biarray.ItemValue2!='-'){
                     biarray.ItemKey2 = wsres.result.qDataPages[0].qMatrix[i][6].qText ||'-';
                     }else{
                      
                      biarray.ItemKey2='-'
                     }

                     
                     biarray.objid = '';
                     //biarray.category = wsres.result.qDataPages[0].qMatrix[i][3].qText;
                     //biarray.status = wsres.result.qDataPages[0].qMatrix[i][7].qText;
                     if(biarray.ItemValue1 !='-' || biarray.ItemValue2 !='-'){
                       businessInsightsArray.push(biarray);
                     }
                       biarray={};
                   }

                   // else if(wsres.result.qDataPages[0].qMatrix[i][0].qText>=6){
                   //   salesData[wsres.result.qDataPages[0].qMatrix[i][4].qText]=wsres.result.qDataPages[0].qMatrix[i][6].qText;
                   // }

                  
                }


              var tqf= parseInt(wsres.result.qDataPages[0].qMatrix[6][7].qText);
              var uqf= parseInt(wsres.result.qDataPages[0].qMatrix[7][7].qText);

              console.log('tqf',tqf)
              console.log('uqf',uqf)
              console.log(tqf*100/(tqf+uqf));
              salesData.TQFValue = wsres.result.qDataPages[0].qMatrix[6][8].qText ||'-';
              salesData.TQFPercentage =  (tqf*100/(tqf+uqf)).toFixed(1)+'%' ||'-';
              
              salesData.UQFValue = wsres.result.qDataPages[0].qMatrix[7][8].qText||'-';
              
              salesData.UQFPercentage = (uqf*100/(tqf+uqf)).toFixed(1)+'%' ||'-'; 
              salesData.WINRate = wsres.result.qDataPages[0].qMatrix[8][8].qText ||'-';
              salesData.FYDate = wsres.result.qDataPages[0].qMatrix[9][8].qText ||'-';
              salesData.FSValue= wsres.result.qDataPages[0].qMatrix[10][8].qText ||'-';
              salesData.FSColor= wsres.result.qDataPages[0].qMatrix[10][7].qText ||'-';
              salesData.FSKey= wsres.result.qDataPages[0].qMatrix[10][9].qText ||'-';
              salesData.PipelineLastReload= wsres.result.qDataPages[0].qMatrix[11][8].qText ||'-';
              salesData.BillingURL='http://10.2.5.158:4011/scr/ticket/user/'+user_directory+'/'+user_id+'?client_id=merlin&scope=ticket&open=http://10.2.5.158/node/extensions/Billing/Billing.html';
              salesData.BookingURL='http://10.2.5.158:4011/scr/ticket/user/'+user_directory+'/'+user_id+'?client_id=merlin&scope=ticket&open=http://10.2.5.158/node/extensions/Booking/Booking.html';
              salesData.PipeLineURL='http://10.2.5.158:4011/scr/ticket/user/'+user_directory+'/'+user_id+'?client_id=merlin&scope=ticket&open=http://10.2.5.158/node/sense/app/856f4e5b-4d75-40be-a0f0-2a17aa8f3875';

              salesData.QlikInsightData=businessInsightsArray;
                               
               var date = new Date();
               console.log('Sales business insights ',date);
               
               cb(null,salesData);
               salesData={};
               //cb(null,businessInsights);
               //businessInsights=[];
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
          qendpoint.qlik_ws+'app/'+m_object.extractLeaderDataAppID+'?reloadUri='+qendpoint.qlik_proxy_pt+'dev-hub/engine-api-explorer&QlikTicket='+data.token
          );

      }
      else if(data.target=='SESSION'){

        var ws = new WebSocket(
          qendpoint.qlik_ws+'app/'+m_object.extractLeaderDataAppID+'?reloadUri='+qendpoint.qlik_proxy_pt+'dev-hub/engine-api-explorer',
          [],
          {
            'headers': {
              'Cookie': 'X-Qlik-Session-Node='+data.token
            }
          }
          );
      }

      var opendocForLeaderboard = e_function.opendoc(1,openDocHandle,m_object.extractLeaderDataAppID);
      ws.on('open', function open() {
        ws.send(JSON.stringify(opendocForLeaderboard));
      });

      ws.on('message', function(data, flags) {
        var wsres = JSON.parse(data);
              //console.log(wsres);
              if(wsres.params && wsres.params.logoutUri == qendpoint.ws_logout+'qps/user'){
                //console.log('user is successfully logged in sales performance with session')
              }
              if(wsres.id==1){
                var date = new Date();
                console.log('Session opened at ',date);

                if(wsres.error && wsres.error.code==403){
                  var e={};
                  var emessage = {};
                  emessage.error_id = 403;
                  emessage.error_message ='You do not have leaderboard access';
                  e.status = 403;
                  e.message = emessage;
                  
                  
                  return cb(e)
                }

                
                ws.send(JSON.stringify(e_function.clearFilter()));
              }
              if(wsres.id==501){
                var getobjectForLeaderboard = e_function.getobject(2,getObjectHandle,m_object.extractLeaderDataObjID);
                ws.send(JSON.stringify(getobjectForLeaderboard));
              }
              if(wsres.id==2){
                //console.log(wsres);
                handle = wsres.result.qReturn.qHandle;
                var getlayoutForLeaderboard = e_function.getLayout(3,handle);
                ws.send(JSON.stringify(getlayoutForLeaderboard));
              }
              if(wsres.id==3){

                if (!wsres.result) {
                  return cb(null,leaderData);
                }
                
                var lbOpt = wsres.result.qLayout.qHyperCube.qGrandTotalRow;
                

                leaderData.performance =[];

                var billing ={};

                billing.FyYear = wsres.result.qLayout.qHyperCube.qDimensionInfo[0].qMax;
                billing.Type = 'BILLING';
                billing.TargetValue = lbOpt[1].qText;
                billing.TargetValueRaw = lbOpt[1].qNum;
                billing.ActualValue = lbOpt[0].qText
                billing.ActualValueRaw = lbOpt[0].qNum;
                billing.PercentageAcheived = lbOpt[2].qText;
                billing.ActualDistributionList=[];

                leaderData.performance.push(billing);

                var booking ={};

                booking.FyYear = wsres.result.qLayout.qHyperCube.qDimensionInfo[0].qMax;
                booking.Type = 'BOOKING';
                booking.TargetValue = lbOpt[4].qText;
                booking.TargetValueRaw = lbOpt[4].qNum;
                booking.ActualValue = lbOpt[3].qText
                booking.ActualValueRaw = lbOpt[3].qNum;
                booking.PercentageAcheived = lbOpt[5].qText;
                booking.ActualDistributionList=[];

                leaderData.performance.push(booking);
                var rows_height = 12;
                var cloumns_width =9;
                var gethypercubeForLeaderboard = e_function.gethypercube(4,handle,rows_height,cloumns_width);
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
                var date = new Date();
                console.log('Leaderboard booking data completed at ',date);
                var getobjectForLeaderboardPipeline = e_function.getobject(5,getObjectHandle,m_object.LeaderboardPipelineObjID);
                ws.send(JSON.stringify(getobjectForLeaderboardPipeline));

             }

             if(wsres.id==5){
              handle = wsres.result.qReturn.qHandle;
              var getlayoutForLeaderboardPipeline = e_function.getLayout(6,handle);
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
              
              var date = new Date();
              console.log('Leaderboard funnel summry completed at ',date);
              var getobjectForBillingFocusLeader = e_function.getobject(7,getObjectHandle,m_object.BillingFocusLeaderObjID);
              ws.send(JSON.stringify(getobjectForBillingFocusLeader));

            }

            if(wsres.id==7){
              handle = wsres.result.qReturn.qHandle;
              var rows_height = 7;
              var cloumns_width =4;
              var gethypercubeForBillingingFocusLeader = e_function.gethypercube(8,handle,rows_height,cloumns_width);
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
             var getobjectForBookingFocusLeader = e_function.getobject(9,getObjectHandle,m_object.BookingFocusLeaderObjID);
             ws.send(JSON.stringify(getobjectForBookingFocusLeader));

           }
           if(wsres.id==9){
            handle = wsres.result.qReturn.qHandle;
            var rows_height = 10;
            var cloumns_width =4;
            var gethypercubeForBookingFocusLeader = e_function.gethypercube(10,handle,rows_height,cloumns_width);
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
            var getobjectForPipelineFocusLeader = e_function.getobject(11,getObjectHandle,m_object.PipelineFocusLeaderObjID);
            ws.send(JSON.stringify(getobjectForPipelineFocusLeader));

          }
          if(wsres.id==11){
            handle = wsres.result.qReturn.qHandle;
            var rows_height = 10;
            var cloumns_width =4;
            var gethypercubeForPipelineFocusLeader = e_function.gethypercube(12,handle,rows_height,cloumns_width);
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
            var date = new Date();
            console.log('Leaderboard bfocus acc for all 3 completed at ',date);
            var getobjectForBookingOppurtunityLeader = e_function.getobject(13,getObjectHandle,m_object.BookingOppurtunityLeaderObjID);
            ws.send(JSON.stringify(getobjectForBookingOppurtunityLeader));

          }
          if(wsres.id==13){
            handle = wsres.result.qReturn.qHandle;
            var rows_height = 10;
            var cloumns_width =7;
            var gethypercubeForBookingOppurtunityLeader = e_function.gethypercube(14,handle,rows_height,cloumns_width);
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
            var getobjectForPipelineOppurtunityLeader = e_function.getobject(15,getObjectHandle,m_object.PipelineOppurtunityLeaderObjID);
            ws.send(JSON.stringify(getobjectForPipelineOppurtunityLeader));

          }
          if(wsres.id==15){
            handle = wsres.result.qReturn.qHandle;
            var rows_height = 10;
            var cloumns_width =7;
            var gethypercubeForPipelineOppurtunityLeader = e_function.gethypercube(16,handle,rows_height,cloumns_width);
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
                   leaderData.TopOpportunityList.push(pipelineOppurtunities);
                 }
                 var date = new Date();
                 console.log('Leaderboard data completed at ',date);
                 cb(null,leaderData);
                 leaderData=[];
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
          qendpoint.qlik_ws+'app/'+m_object.extractLeaderDataAppID+'?reloadUri='+qendpoint.qlik_proxy_pt+'dev-hub/engine-api-explorer&QlikTicket='+data.token
          );

      }
      else if(data.target=='SESSION'){

        var ws = new WebSocket(
          qendpoint.qlik_ws+'app/'+m_object.extractLeaderDataAppID+'?reloadUri='+qendpoint.qlik_proxy_pt+'dev-hub/engine-api-explorer',
          [],
          {
            'headers': {
              'Cookie': 'X-Qlik-Session-Node='+data.token
            }
          }
          );
      }

      var opendocForLeaderboard = e_function.opendoc(1,openDocHandle,m_object.extractLeaderDataAppID);
      ws.on('open', function open() {
        ws.send(JSON.stringify(opendocForLeaderboard));
      });

      ws.on('message', function(data, flags) {

        var wsres = JSON.parse(data);
        
        if(wsres.params && wsres.params.logoutUri == qendpoint.ws_logout+'qps/user'){
        }
        if(wsres.id==1){
          var date = new Date();
          console.log('Leaderboard deepdive session opened at ',date);


          if(wsres.error && wsres.error.code==403){
            var e={};
            var emessage = {};
            emessage.error_id = 403;
            emessage.error_message ='You do not have leaderboard access';
            e.status = 403;
            e.message = emessage;


            return cb(e)
          }
           ws.send(JSON.stringify(e_function.clearFilter()));
        }
        if(wsres.id==501){
          var oppurtunityDeepdiveObject = e_function.getobject(17,getObjectHandle,m_object.extractOppurtunityLeaderDeepdiveObjID);
          ws.send(JSON.stringify(oppurtunityDeepdiveObject));
        }

        if(wsres.id==17){
                //console.log(wsres);
                handle = wsres.result.qReturn.qHandle;
                var rows_height = 120;
                var cloumns_width =7;
                var oppurtunityDeepdiveHypercube = e_function.gethypercube(18,handle,rows_height,cloumns_width);
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
                var FunnelTeamObject = e_function.getobject(19,getObjectHandle,m_object.FunnelTeamObjID);
                ws.send(JSON.stringify(FunnelTeamObject));
                //cb(null,leaderDeepDiveData);

              }

              if(wsres.id==19){
                //console.log(wsres);
                handle = wsres.result.qReturn.qHandle;
                var rows_height = 20;
                var cloumns_width =30;
                var FunnelTeamHypercubePivot = e_function.gethypercubepivot(20,handle,rows_height,cloumns_width);
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
                var Focus150Object = e_function.getobject(21,getObjectHandle,m_object.Focus150ObjID);
                ws.send(JSON.stringify(Focus150Object));

              }


              if(wsres.id==21){
                //console.log(wsres);
                handle = wsres.result.qReturn.qHandle;
                var rows_height = 1000;
                var cloumns_width =155;
                var Focus150HypercubePivot = e_function.gethypercubepivot(22,handle,rows_height,cloumns_width);
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

                  for(var j = 1; j<=3; j++){
                  var stage={};

                  stage.Type = 'L'
                  stage.TypeText = wsres.result.qDataPages[0].qTop[j].qText;
                  stage.RawValue = wsres.result.qDataPages[0].qData[i][j].qText;
                  TAccounts.DataList.push(stage);
                  }
                  for(var j = 4; j<=6; j++){
                  var stage={};

                  stage.Type = 'B'
                  stage.TypeText = wsres.result.qDataPages[0].qTop[j].qText;
                  stage.RawValue = wsres.result.qDataPages[0].qData[i][j].qText;
                  TAccounts.DataList.push(stage);
                  }

                  leaderDeepDiveData.Funnel.TopAccounts.push(TAccounts);

                }
                //return cb(null,leaderDeepDiveData);
                var date = new Date();
                console.log('Leaderboard deepdive part1 completed at ',date);
                var TopAccountsGetObject = e_function.getobject(23,getObjectHandle,m_object.TopAccountsObjID);
                ws.send(JSON.stringify(TopAccountsGetObject));
                //ws.send(JSON.stringify(getObjectLeaderboardBooking)); // Abhishek

              }

              if(wsres.id==23){ // 23 Abhishek
                handle = wsres.result.qReturn.qHandle;
                var rows_height = 1000;
                var cloumns_width =155;
                var TopAccountsHypercubePivot = e_function.gethypercubepivot(24,handle,rows_height,cloumns_width);
                ws.send(JSON.stringify(TopAccountsHypercubePivot));
                //ws.send(JSON.stringify(getHypercubePivotLeaderboardBooking)); // Abhishek
              }
              if(wsres.id==24){ //24 Abhishek

                //console.log(wsres.result)
                if (!wsres.result) {
                  return cb(null,leaderData);
                }
                var SlineLength = wsres.result.qDataPages[0].qTop.length;
                for(var i=0; i<wsres.result.qDataPages[0].qLeft.length; i++){
                  for(var j = 0; j<SlineLength; j++){
                  
                    var stage={};
                    stage.Type = 'S'
                    stage.TypeText = wsres.result.qDataPages[0].qTop[j].qText;
                    stage.RawValue = wsres.result.qDataPages[0].qData[i][j].qText;
                    leaderDeepDiveData.Funnel.TopAccounts[i].DataList.push(stage);
                  }
                }
                var getObjectLeaderboardBooking = e_function.getobject(25,getObjectHandle,m_object.LeaderboardBookingObjID);
                ws.send(JSON.stringify(getObjectLeaderboardBooking));
              }
              if(wsres.id==25){ // 23 Abhishek
                handle = wsres.result.qReturn.qHandle;
                var rows_height = 155;
                var cloumns_width =155;
                var getHypercubePivotLeaderboardBooking = e_function.gethypercubepivot(26,handle,rows_height,cloumns_width);
                ws.send(JSON.stringify(getHypercubePivotLeaderboardBooking)); // Abhishek
              }
              if(wsres.id==26){ //24 Abhishek

                //console.log(wsres.result)
                if (!wsres.result) {
                  return cb(null,leaderData);
                }
                
                //leaderDeepDiveData={};
                leaderDeepDiveData.Booking={};
                leaderDeepDiveData.Booking.Performance=[];
                var SLinelengthJAS;
                var SLinelengthOND;
                var SLinelengthJFM;
                var SLinelengthAMJ;
                var Sline;
                for(var i=0; i<=11; i++){
                  var finalobj = {};
                  var j,k;
                  if(i<3){
                    SLinelengthJAS = wsres.result.qDataPages[0].qLeft[0].qSubNodes.length;
                    Sline = SLinelengthJAS;
                    finalobj.Quarter = wsres.result.qDataPages[0].qLeft[0].qText.substring(0,3);
                    finalobj.Actual = wsres.result.qDataPages[0].qData[0][i+1].qText;
                    finalobj.Target = wsres.result.qDataPages[0].qData[0][i+17].qText;
                    finalobj.TargetorActual = wsres.result.qDataPages[0].qData[0][i+29].qText;
                    j=1;
                  }if(i>=3 & i <= 5){
                    SLinelengthOND = wsres.result.qDataPages[0].qLeft[1].qSubNodes.length;
                    Sline = SLinelengthOND;
                    finalobj.Quarter = wsres.result.qDataPages[0].qLeft[1].qText.substring(0,3);
                    finalobj.Actual = wsres.result.qDataPages[0].qData[SLinelengthJAS][i-2].qText;
                    finalobj.Target = wsres.result.qDataPages[0].qData[SLinelengthJAS][i+14].qText;
                    finalobj.TargetorActual = wsres.result.qDataPages[0].qData[SLinelengthJAS][i+26].qText;
                    j=1+SLinelengthJAS;
                  }
                  if(i>=6 & i <= 8){
                    SLinelengthJFM = wsres.result.qDataPages[0].qLeft[2].qSubNodes.length;
                    Sline = SLinelengthJFM;
                    finalobj.Quarter = wsres.result.qDataPages[0].qLeft[2].qText.substring(0,3);
                    finalobj.Actual = wsres.result.qDataPages[0].qData[SLinelengthJAS+SLinelengthOND][i-5].qText;
                    finalobj.Target = wsres.result.qDataPages[0].qData[SLinelengthJAS+SLinelengthOND][i+11].qText;
                    finalobj.TargetorActual = wsres.result.qDataPages[0].qData[SLinelengthJAS+SLinelengthOND][i+23].qText;
                    j=1+SLinelengthJAS+SLinelengthOND;
                  }
                  if(i>=9 & i <= 11){
                    SLinelengthAMJ = wsres.result.qDataPages[0].qLeft[3].qSubNodes.length;
                    Sline = SLinelengthAMJ;
                    finalobj.Quarter = wsres.result.qDataPages[0].qLeft[3].qText.substring(0,3);
                    finalobj.Actual = wsres.result.qDataPages[0].qData[SLinelengthJAS+SLinelengthOND+SLinelengthAMJ][i-8].qText;
                    finalobj.Target = wsres.result.qDataPages[0].qData[SLinelengthJAS+SLinelengthOND+SLinelengthAMJ][i+8].qText;
                    finalobj.TargetorActual = wsres.result.qDataPages[0].qData[SLinelengthJAS+SLinelengthOND+SLinelengthAMJ][i+20].qText;
                    j=1+SLinelengthJAS+SLinelengthOND+SLinelengthJFM;
                  }
                  switch(i%3){
                    case 0:
                    finalobj.BType = 'NN'
                    k=1
                    break;
                    case 1:
                    finalobj.BType = 'EN'
                    k=2
                    break;
                    case 2:
                    finalobj.BType = 'EE'
                    k=3
                    break;
                  }
                  var DList = [];
                  var n = 1;

                  for(var m=j; m<=j+Sline-2; m++){
                   // console.log("n--- ", n, j, m, k);
                    var obj = {};
                    if(i<3){
                      obj.SLine = wsres.result.qDataPages[0].qLeft[0].qSubNodes[n].qText;
                    }
                    if(i>=3 & i <= 5){
                      obj.SLine = wsres.result.qDataPages[0].qLeft[1].qSubNodes[n].qText;
                    }if(i>=6 & i <= 8){
                      obj.SLine = wsres.result.qDataPages[0].qLeft[2].qSubNodes[n].qText;
                    }if(i>=9 & i <= 11){
                      obj.SLine = wsres.result.qDataPages[0].qLeft[3].qSubNodes[n].qText;
                    }
                    //obj.SLine = wsres.result.qDataPages[0].qLeft[0].qSubNodes[n].qText;
                    obj.Value = wsres.result.qDataPages[0].qData[m][k].qText;

                    DList.push(obj);
                   // console.log("DList--- ", DList);
                    n++;
                  }
                  
                  finalobj.DList = DList;
                  leaderDeepDiveData.Booking.Performance.push(finalobj);
                }
                //return cb(null,leaderDeepDiveData);
                var getObjectBookingTeam = e_function.getobject(27,getObjectHandle,m_object.BookingTeamObjID);
                ws.send(JSON.stringify(getObjectBookingTeam));

              }

              if(wsres.id==27){
                handle = wsres.result.qReturn.qHandle;
                var rows_height = 155;
                var cloumns_width =155;
                var getHypercubePivotBookingTeam = e_function.gethypercubepivot(28,handle,rows_height,cloumns_width);
                ws.send(JSON.stringify(getHypercubePivotBookingTeam));
              }
              if(wsres.id==28){


                if (!wsres.result) {
                  return cb(null,leaderData);
                }
                BookingTeamData = wsres;
                var getObjectBookingTeamServiceLine = e_function.getobject(29,getObjectHandle,m_object.BookingTeamServiceLineObjID);
                ws.send(JSON.stringify(getObjectBookingTeamServiceLine))
              }
                
              if(wsres.id == 29){
                handle = wsres.result.qReturn.qHandle;
                var rows_height = 155;
                var cloumns_width =155;
                var gethypercubePivotBookingTeamServiceLine = e_function.gethypercubepivot(30,handle,rows_height,cloumns_width);
                ws.send(JSON.stringify(gethypercubePivotBookingTeamServiceLine))
              }
              if(wsres.id == 30){
                  //ServiceLineData = wsres;
                  leaderDeepDiveData.Booking.PerformanceTeam=[];
                  var j=0;

                  var counter =1;
                  //return cb(null, wsres)
                  for(var i=0;i<BookingTeamData.result.qDataPages[0].qData.length;i++){

  //Remove l with i , no use of 
                    var k= i;
                    var l= i;
                    //if(i<90){
                      var member={};
                      var bilinker=1;

                      for(i;i<k+3;i++){

                        for(counter=1;counter< BookingTeamData.result.qDataPages[0].qLeft[j].qSubNodes.length;counter++){
                          member.MemberName = BookingTeamData.result.qDataPages[0].qLeft[j].qText;

                          if(bilinker<5){
                            member.BType = BookingTeamData.result.qDataPages[0].qTop[0].qSubNodes[bilinker].qText
                          }

                          member.Actual = BookingTeamData.result.qDataPages[0].qData[l+counter][bilinker].qText
                          member.Target = BookingTeamData.result.qDataPages[0].qData[l+counter][bilinker+4].qText
                          member.TargetorActual = BookingTeamData.result.qDataPages[0].qData[l+counter][bilinker+12].qText
                          //console.log(l,counter,member.Actual)
                          member.Quarter = BookingTeamData.result.qDataPages[0].qLeft[j].qSubNodes[counter].qText.substring(0,3);
                          member.DList=[];
                          for(var t = 0; t< wsres.result.qDataPages[0].qTop.length; t++){
                            var serviceLine = {};
                            //console.log("bilinker--- ", bilinker);
                            serviceLine.SLine = wsres.result.qDataPages[0].qTop[t].qText;
                            serviceLine.ActualValue = wsres.result.qDataPages[0].qData[l+counter][bilinker+t*4].qText;
                            member.DList.push(serviceLine);
                          }

                          leaderDeepDiveData.Booking.PerformanceTeam.push(member);
                          member={};

                        }
                        bilinker=bilinker+1;
                      }


                      j=j+1;
                      i=i+1;                  
                    
                  //}

                }
               // return cb(null,leaderDeepDiveData);
              var ObjectBookingOpportinity = e_function.getobject(31,getObjectHandle, m_object.BookingOppurtunityLeaderDeepdive);
              ws.send(JSON.stringify(ObjectBookingOpportinity));

                }
              if(wsres.id==31){
                handle = wsres.result.qReturn.qHandle;
                var rows_height = 1000;
                var cloumns_width =10;
                var DataBookingOpportunity = e_function.gethypercube(32,handle,rows_height,cloumns_width);
                ws.send(JSON.stringify(DataBookingOpportunity));

              }
              
              if(wsres.id==32){

                //leaderDeepDiveData={};
                leaderDeepDiveData.Booking.WINS=[];
                for(var i=0;i<wsres.result.qDataPages[0].qMatrix.length;i++){

                  var winarray = {};

                 winarray.BType = wsres.result.qDataPages[0].qMatrix[i][0].qText;
                  winarray.Quarter = wsres.result.qDataPages[0].qMatrix[i][4].qText.substring(0,3);
                  winarray.OValue = wsres.result.qDataPages[0].qMatrix[i][6].qText;
                  winarray.OName = wsres.result.qDataPages[0].qMatrix[i][3].qText;
                  winarray.AccountGroup = wsres.result.qDataPages[0].qMatrix[i][1].qText;

                  leaderDeepDiveData.Booking.WINS.push(winarray)
                  winarray={};

                }
                
                var date = new Date();
                console.log('Leaderboard deepdive part2 completed at ',date);
                var getobjectForWINSTeam = e_function.getobject(33,getObjectHandle, m_object.WINSTeamObjID);
                ws.send(JSON.stringify(getobjectForWINSTeam));
                //return cb(null,leaderDeepDiveData);

              }
              if(wsres.id==33){
                handle = wsres.result.qReturn.qHandle;
                var rows_height = 100;
                var cloumns_width =100;
                var gethypercubeForWINSTeam = e_function.gethypercube(34,handle,rows_height,cloumns_width);
                ws.send(JSON.stringify(gethypercubeForWINSTeam));

              }
              
              if(wsres.id==34){

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
                var date = new Date();
                console.log('Leaderboard deepdive part3 completed at ',date);
                return cb(null,leaderDeepDiveData);

              }
              

            });
},


extractLeaderBillingData: function(data, cb){
  var leaderBillingeData = {};
  leaderBillingeData.error_id = 0;
  leaderBillingeData.error_message ='Success';
  leaderBillingeData.Billing ={};
  leaderBillingeData.Billing.Performance=[];
  leaderBillingeData.Billing.PerformanceTeam=[];

      
      if(data.target=='TICKET'){

        var ws = new WebSocket(
          qendpoint.qlik_ws+'app/'+m_object.extractLeaderDataAppID+'?reloadUri='+qendpoint.qlik_proxy_pt+'dev-hub/engine-api-explorer&QlikTicket='+data.token
          );

      }
      else if(data.target=='SESSION'){

        var ws = new WebSocket(
          qendpoint.qlik_ws+'app/'+m_object.extractLeaderDataAppID+'?reloadUri='+qendpoint.qlik_proxy_pt+'dev-hub/engine-api-explorer',
          [],
          {
            'headers': {
              'Cookie': 'X-Qlik-Session-Node='+data.token
            }
          }
          );
      }

      var opendocForLeaderboard = e_function.opendoc(1,openDocHandle,m_object.extractLeaderDataAppID);
      ws.on('open', function open() {

        ws.send(JSON.stringify(opendocForLeaderboard));
      });

      ws.on('message', function(data, flags) {

        var wsres = JSON.parse(data);
        
        if(wsres.params && wsres.params.logoutUri == qendpoint.ws_logout+'qps/user'){
        }
        if(wsres.id==1){
          var date = new Date();
          console.log('Leaderboard billing session opened at ',date);


          if(wsres.error){
            var e={};
            var emessage = {};
            emessage.error_id = 403;
            emessage.error_message ='You do not have leaderboard billing access';
            e.status = 403;
            e.message = emessage;


            return cb(e)
          }
          ws.send(JSON.stringify(e_function.clearFilter()));
        }
        if(wsres.id==501){
          var getLeaderboardBillingPerformance = e_function.getobject(2,getObjectHandle,m_object.leaderBoardBillingPerformanceObjID);
          ws.send(JSON.stringify(getLeaderboardBillingPerformance));
        }
        if(wsres.id==2){
          handle = wsres.result.qReturn.qHandle;
          var rows_height = 100;
          var cloumns_width =12;
          var LeaderboardBillingPerformanceHypercube = e_function.gethypercube(3,handle,rows_height,cloumns_width);
          ws.send(JSON.stringify(LeaderboardBillingPerformanceHypercube));
        }
        if(wsres.id==3){

          if (!wsres.result) {
            return cb(null,leaderBillingeData);
          }
          leaderBillingeData.Billing.Performance=[];
          for(var i = 0; i<wsres.result.qDataPages[0].qMatrix.length; i++){
            var performanceObj ={};
            performanceObj.Quarter = wsres.result.qDataPages[0].qMatrix[i][0].qText.slice(0, -2);
            performanceObj.Actual = wsres.result.qDataPages[0].qMatrix[i][1].qText;
            performanceObj.Target = wsres.result.qDataPages[0].qMatrix[i][2].qText;
            performanceObj.TargetorActual = wsres.result.qDataPages[0].qMatrix[i][3].qText;
            leaderBillingeData.Billing.Performance.push(performanceObj);
          }
          //return cb(null, leaderBillingeData);
          var getLeaderboardBillingPerformanceSecond = e_function.getobject(4,getObjectHandle,m_object.leaderboardBillingPerformanceSecondObjID);
          ws.send(JSON.stringify(getLeaderboardBillingPerformanceSecond));
        }
        if(wsres.id == 4){
          handle = wsres.result.qReturn.qHandle;
          var rows_height = 155;
          var cloumns_width =155;
          var LeaderboardBillingPerformanceHypercubeSecond = e_function.gethypercubepivot(5,handle,rows_height,cloumns_width);
          ws.send(JSON.stringify(LeaderboardBillingPerformanceHypercubeSecond))
        }
        if(wsres.id == 5){
          if (!wsres.result) {
            return cb(null,leaderBillingeData);
          }
          var row = 0;
          for(var i =0; i< leaderBillingeData.Billing.Performance.length; i++){
            leaderBillingeData.Billing.Performance[i].MList = [];
            leaderBillingeData.Billing.Performance[i].DList = [];
            row++;
            for(var j =1; j<=wsres.result.qDataPages[0].qLeft[i].qSubNodes.length-1; j++){
              var list = {};
              list.Month = wsres.result.qDataPages[0].qLeft[i].qSubNodes[j].qText.slice(0, -3);
              list.Value = wsres.result.qDataPages[0].qData[row][0].qText;
              row++;
              leaderBillingeData.Billing.Performance[i].MList.push(list);
            }
            for(var j = 1; j<= wsres.result.qDataPages[0].qTop.length-1; j++){
              var list = {};
              list.SLine = wsres.result.qDataPages[0].qTop[j].qText;
              if(i==0){
                list.Value = wsres.result.qDataPages[0].qData[0][j].qText;
              }else{
                var rowNumber = 0;
                for(var m = i; m>0; m--){
                  rowNumber = rowNumber+wsres.result.qDataPages[0].qLeft[m-1].qSubNodes.length;
                }
                list.Value = wsres.result.qDataPages[0].qData[rowNumber][j].qText;
              }
               leaderBillingeData.Billing.Performance[i].DList.push(list);
            }
          }
          //return cb(null,leaderBillingeData);
          var getObjectLeaderboardBillingPerformanceTeam = e_function.getobject(6,getObjectHandle,m_object.leaderboardBillingPerformanceTeamObjID);
          ws.send(JSON.stringify(getObjectLeaderboardBillingPerformanceTeam))
        }
        if(wsres.id == 6){
          handle = wsres.result.qReturn.qHandle;
          var rows_height = 100;
          var cloumns_width =12;
          var LeaderboardBillingPerformanceTeamHypercube = e_function.gethypercube(7,handle,rows_height,cloumns_width);
          ws.send(JSON.stringify(LeaderboardBillingPerformanceTeamHypercube))
        }
        if(wsres.id == 7){

          if (!wsres.result) {
            return cb(null,leaderBillingeData);
          } 

          for(var i=0;i<wsres.result.qDataPages[0].qMatrix.length;i++)
          {
             var outerObj={};
             outerObj.MemberName=wsres.result.qDataPages[0].qMatrix[i][0].qText;
             outerObj.Actual=wsres.result.qDataPages[0].qMatrix[i][1].qText;
             outerObj.Target=wsres.result.qDataPages[0].qMatrix[i][2].qText;
             outerObj.TargetorActual=wsres.result.qDataPages[0].qMatrix[i][3].qText;
             leaderBillingeData.Billing.PerformanceTeam.push(outerObj);
          } 
          //return cb(null, leaderBillingeData);
           var getLeaderboardBillingPerformanceTeamSecond = e_function.getobject(8,getObjectHandle,m_object.leaderboardBillingPerformanceTeamSecondObjID);
          ws.send(JSON.stringify(getLeaderboardBillingPerformanceTeamSecond))
        }
        if(wsres.id == 8){
          handle = wsres.result.qReturn.qHandle;
          var rows_height = 1000;
          var cloumns_width =20;
          var LeaderboardBillingPerformanceTeamHypercubeSecond = e_function.gethypercubepivot(9,handle,rows_height,cloumns_width);
          ws.send(JSON.stringify(LeaderboardBillingPerformanceTeamHypercubeSecond))
        }
        if(wsres.id == 9){

          if (!wsres.result) {
            return cb(null,leaderBillingeData);
          }

          var l=0,k=0,n=1; 
          var sLineLength=wsres.result.qDataPages[0].qTop.length;
          for(var m=0;m<leaderBillingeData.Billing.PerformanceTeam.length;m++){
            var quarterLength=wsres.result.qDataPages[0].qLeft[m].qSubNodes.length;
            leaderBillingeData.Billing.PerformanceTeam[m].DList=[];
            leaderBillingeData.Billing.PerformanceTeam[m].QList=[];
            for(var j=1;j<=sLineLength-1;j++)
            {
            var innerObj={};
            innerObj.SLine = wsres.result.qDataPages[0].qTop[j].qText;
            innerObj.Value=wsres.result.qDataPages[0].qData[l][j].qText;
            leaderBillingeData.Billing.PerformanceTeam[m].DList.push(innerObj);
            }
            for(var k=1;k<=quarterLength-1;k++)
            {
            var innerObjQ={};
            innerObjQ.Quarter=wsres.result.qDataPages[0].qLeft[m].qSubNodes[k].qText.substr(0,3);
            innerObjQ.Value=wsres.result.qDataPages[0].qData[n][0].qText;
            leaderBillingeData.Billing.PerformanceTeam[m].QList.push(innerObjQ);
            n++;
            }
            l=l+quarterLength;
            n++;
          }
          return cb(null, leaderBillingeData);
        }
      })
}

};
module.exports = qlik;
