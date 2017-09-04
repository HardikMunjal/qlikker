'use strict';

var qlikauth = require('../../qlik-auth');
var request = require('request');
var ejs = require('ejs');
var fs = require('fs');
var WebSocket = require('ws');
var utility = require('../utility');
var qendpoint = require('../../../config/endpoint');
var s_object = require('../../../config/symphony_object');
var e_function = require('../../../config/engine_funct');
var openDocHandle=-1;
var getObjectHandle=1;


var FinanceData = [];
var businessInsights=[];
var qlik = {

    extractFinanceData: function(data,cb) {

      if(data.target=='TICKET'){

         var ws = new WebSocket(
            qendpoint.qlik_ws+'app/'+s_object.symphonyIntegeratedAppID+'?reloadUri='+qendpoint.qlik_proxy_pt+'dev-hub/engine-api-explorer&QlikTicket='+data.token
            );

        }
    else if(data.target=='SESSION'){

      var ws = new WebSocket(
        qendpoint.qlik_ws+'app/'+s_object.symphonyIntegeratedAppID+'?reloadUri='+qendpoint.qlik_proxy_pt+'dev-hub/engine-api-explorer',
        [],
        {
          'headers': {
            'Cookie': 'X-Qlik-Session-Node='+data.token
          }
        }
        );
      }
    var opendocIntegrated = e_function.opendoc(1,openDocHandle,s_object.symphonyIntegeratedAppID);
    ws.on('open', function open() {
      ws.send(JSON.stringify(opendocIntegrated));
    });

    //**************************** INCOMING MESSAGE EVENT *****************************
    ws.on('message', function(data, flags) {
      
      var wsres = JSON.parse(data);
      //console.log(wsres)
      if(wsres.params && wsres.params.logoutUri == qendpoint.ws_logout+'qps/user'){
          //console.log('user is successfully logged in sales performance with session')
      }
      if(wsres.error){
        return;
      }
      if(wsres.id==1){
        var getobjectFinance = e_function.getobject(2,getObjectHandle,s_object.financeDataObjID);
        ws.send(JSON.stringify(getobjectFinance));
      }
      if(wsres.id==2){
        var handle = wsres.result.qReturn.qHandle;
        var rows_height = 12;
        var cloumns_width = 20;
        var getPivotFinance = e_function.gethypercube(3,handle,rows_height,cloumns_width);
        ws.send(JSON.stringify(getPivotFinance));
      }

      

      if(wsres.id==3){

        if (!wsres.result) {
                      
                      
                    }

                    var financeData = {};
                    financeData.error_id = 0;
                    financeData.error_message ='Success'
                      financeData.Finance = {};

                      financeData.Finance.DataDate=wsres.result.qDataPages[0].qMatrix[0][16].qText;//'JUN-2017';
                      financeData.Finance.QlikURL='http://10.2.5.158:4011/scr/ticket/user/$user_directory/$user_id?client_id=delivery&scope=ticket&open=http://10.2.5.158/node/extensions/FinanceSummaryCD3/FinanceSummaryCD3.html?view=YTD'
                      financeData.Finance.ExpenseURL='http://10.2.5.158:4011/scr/ticket/user/$user_directory/$user_id?client_id=delivery&scope=ticket&open=http://10.2.5.158/node/extensions/ExpenseResourceCD3/ExpenseResourceCD3.html';
                      financeData.Finance.Data=[];

                      var yearend = {}

                      yearend.FY=wsres.result.qDataPages[0].qMatrix[0][16].qText.substr(4,4);//2017';
                      yearend.Revenue= wsres.result.qDataPages[0].qMatrix[0][0].qText;
                      yearend.ProjectMargin= wsres.result.qDataPages[0].qMatrix[0][1].qText;
                      yearend.Resource= wsres.result.qDataPages[0].qMatrix[0][2].qText;
                      yearend.Travel= wsres.result.qDataPages[0].qMatrix[0][4].qText;
                      yearend.Project= wsres.result.qDataPages[0].qMatrix[0][3].qText;
                      
                      var monthend = {}
                      monthend.FY=wsres.result.qDataPages[0].qMatrix[0][16].qText;//'JUN-2017';
                      monthend.Revenue= wsres.result.qDataPages[0].qMatrix[0][8].qText;
                      monthend.ProjectMargin= wsres.result.qDataPages[0].qMatrix[0][9].qText;
                      monthend.Resource= wsres.result.qDataPages[0].qMatrix[0][10].qText;
                      monthend.Travel= wsres.result.qDataPages[0].qMatrix[0][12].qText;
                      monthend.Project= wsres.result.qDataPages[0].qMatrix[0][11].qText;


                      financeData.Finance.Data.push(yearend);
                      financeData.Finance.Data.push(monthend);

                      financeData.ValueCreation = {};
                      financeData.ValueCreation.ValueDelivered = wsres.result.qDataPages[0].qMatrix[0][5].qText;
                      financeData.ValueCreation.IdeaGenerated= wsres.result.qDataPages[0].qMatrix[0][6].qText;

                      financeData.ValueCreation.IdeaImplemented= wsres.result.qDataPages[0].qMatrix[0][7].qText;
                      financeData.ValueCreation.FY=wsres.result.qDataPages[0].qMatrix[0][17].qText;//'JUL-2017';
                      financeData.ValueCreation.QlikURL = 'http://10.2.5.158:4011/scr/ticket/user/$user_directory/$user_id?client_id=delivery&scope=ticket&open=http://10.2.5.158/node/extensions/ValueCreationCD3/ValueCreationCD3.html?view=YTD';


                   cb(null,financeData);
                   //businessInsights=[];
                    //console.log('Performance Business insights from sesssion');
                    
                  }
            });

    //************************** OPEN EVENT *************************************


    },

    extractValueData: function(data,cb) {

    if(data.target=='TICKET'){

    var ws = new WebSocket(
    qendpoint.qlik_ws+'app/'+s_object.symphonyIntegeratedAppID+'?reloadUri='+qendpoint.qlik_proxy_pt+'dev-hub/engine-api-explorer&QlikTicket='+data.token
    );

    }
    else if(data.target=='SESSION'){

    var ws = new WebSocket(
    qendpoint.qlik_ws+'app/'+s_object.symphonyIntegeratedAppID+'?reloadUri='+qendpoint.qlik_proxy_pt+'dev-hub/engine-api-explorer',
    [],
    {
    'headers': {
    'Cookie': 'X-Qlik-Session-Node='+data.token
    }
    }
    );
    }

    var opendocIntegrated = e_function.opendoc(1,openDocHandle, s_object.symphonyIntegeratedAppID);
    ws.on('open', function open() {
    ws.send(JSON.stringify(opendocIntegrated));
    });

    //**************************** INCOMING MESSAGE EVENT *****************************
    ws.on('message', function(data, flags) {

    var wsres = JSON.parse(data);
    if(wsres.error){
    return;
    }
    //console.log(wsres)
    if(wsres.params && wsres.params.logoutUri == qendpoint.ws_logout+'qps/user'){
    //console.log('user is successfully logged in sales performance with session')
    }
    if(wsres.id==1){
    var getobjectFinance = e_function.getobject(2,getObjectHandle,s_object.financeDataSecondObjID);
    ws.send(JSON.stringify(getobjectFinance));
    }
    if(wsres.id==2){
    var handle = wsres.result.qReturn.qHandle;
    var rows_height = 5;
    var cloumns_width = 40;
    var getPivotFinance = e_function.gethypercube(3,handle,rows_height,cloumns_width);
    ws.send(JSON.stringify(getPivotFinance));
    }



    if(wsres.id==3){

    if (!wsres.result) {
              
              
            }

            var valueData = {};
            valueData.error_id = 0;
            valueData.error_message ='Success'
            valueData.KPIDashBoard = {};
            valueData.KPIDashBoard.HeadCountAnalysis = {};
            valueData.KPIDashBoard.HeadCountAnalysis.QlikURL = 'http://10.2.5.158:4011/scr/ticket/user/$user_directory/$user_id?client_id=delivery&scope=ticket&open=http://10.2.5.158/node/extensions/HumanResourceCD3/HumanResourceCD3.html?toggle=1';
            valueData.KPIDashBoard.HeadCountAnalysis.Attrition={};
            valueData.KPIDashBoard.HeadCountAnalysis.Attrition.Total=wsres.result.qDataPages[0].qMatrix[0][6].qText;
            valueData.KPIDashBoard.HeadCountAnalysis.Attrition.Pipeline=wsres.result.qDataPages[0].qMatrix[0][8].qText;
            valueData.KPIDashBoard.HeadCountAnalysis.Attrition.Voluntary=wsres.result.qDataPages[0].qMatrix[0][10].qText;
            valueData.KPIDashBoard.HeadCountAnalysis.Attrition.TotalP=wsres.result.qDataPages[0].qMatrix[0][7].qText;
            valueData.KPIDashBoard.HeadCountAnalysis.Attrition.PipelineP=wsres.result.qDataPages[0].qMatrix[0][9].qText;
            valueData.KPIDashBoard.HeadCountAnalysis.Attrition.InVoluntary=wsres.result.qDataPages[0].qMatrix[0][11].qText;

            valueData.KPIDashBoard.HeadCount={};
            valueData.KPIDashBoard.HeadCount.Joined=wsres.result.qDataPages[0].qMatrix[0][0].qText;
            valueData.KPIDashBoard.HeadCount.newJoinee=wsres.result.qDataPages[0].qMatrix[0][1].qText;
            valueData.KPIDashBoard.HeadCount.InfantAttrition=wsres.result.qDataPages[0].qMatrix[0][2].qText;
            valueData.KPIDashBoard.HeadCount.Freshers=wsres.result.qDataPages[0].qMatrix[0][3].qText;
            valueData.KPIDashBoard.HeadCount.FAI=wsres.result.qDataPages[0].qMatrix[0][4].qText;
            valueData.KPIDashBoard.HeadCount.FreshersP=wsres.result.qDataPages[0].qMatrix[0][5].qText;
            valueData.PCIScore={};
            valueData.PCIScore.AvgPCI=wsres.result.qDataPages[0].qMatrix[0][24].qText;
            valueData.PCIScore.NCCount=wsres.result.qDataPages[0].qMatrix[0][25].qText;
            valueData.PCIScore.PCIRed=wsres.result.qDataPages[0].qMatrix[0][26].qText;
            valueData.PCIScore.PCIAmber=wsres.result.qDataPages[0].qMatrix[0][27].qText;
            valueData.PCIScore.PCSATGreen=wsres.result.qDataPages[0].qMatrix[0][28].qText;
            valueData.PCIScore.PCIND=wsres.result.qDataPages[0].qMatrix[0][23].qText;
            valueData.PCIScore.PCINC=wsres.result.qDataPages[0].qMatrix[0][21].qText;
            valueData.PCIScore.QlikURL='http://10.2.5.158:4011/scr/ticket/user/$user_directory/$user_id?client_id=delivery&scope=ticket&open=http://10.2.5.158/node/sense/app/4a49a417-146f-4dc4-9bca-52912ddaba60/sheet/cHNDfX/state/analysis';
            valueData.PCIScore.QlikRAGURL='http://10.2.5.158:4011/scr/ticket/user/$user_directory/$user_id?client_id=delivery&scope=ticket&open=http://10.2.5.158/node/extensions/PCIRAGStatus/PCIRAGStatus.html?toggle=ALL';
            valueData.PCIScore.DataDate=wsres.result.qDataPages[0].qMatrix[0][29].qText;

    //dont know what is PCINP
            valueData.PCSATScore={};
            valueData.PCSATScore.AvgPCSAT=wsres.result.qDataPages[0].qMatrix[0][13].qText;
            valueData.PCSATScore.PCSATRed=wsres.result.qDataPages[0].qMatrix[0][17].qText;
            valueData.PCSATScore.PCSATAmber=wsres.result.qDataPages[0].qMatrix[0][18].qText;
            valueData.PCSATScore.PCSATGreen=wsres.result.qDataPages[0].qMatrix[0][16].qText;
            valueData.PCSATScore.PNOTPOLL=wsres.result.qDataPages[0].qMatrix[0][15].qText;
            valueData.PCSATScore.PCINP=wsres.result.qDataPages[0].qMatrix[0][14].qText;
            valueData.PCSATScore.QlikURL='http://10.2.5.158:4011/scr/ticket/user/$user_directory/$user_id?client_id=delivery&scope=ticket&open=http://10.2.5.158/node/sense/app/4a49a417-146f-4dc4-9bca-52912ddaba60/sheet/KHPDd/state/analysis';
            valueData.PCSATScore.QlikRAGURL='http://10.2.5.158:4011/scr/ticket/user/$user_directory/$user_id?client_id=delivery&scope=ticket&open=http://10.2.5.158/node/extensions/PCSATRAGStatus/PCSATRAGStatus.html?toggle=ALL';
            valueData.PCSATScore.DataDate=wsres.result.qDataPages[0].qMatrix[0][19].qText;

            cb(null,valueData);
            
          

    }
    });

    //************************** OPEN EVENT *************************************

    
  },

  extractNewBIData: function(data,cb) {


  if(data.target=='TICKET'){

    var ws = new WebSocket(
      qendpoint.qlik_ws+'app/'+s_object.symphonyIntegeratedAppID+'?reloadUri='+qendpoint.qlik_proxy_pt+'dev-hub/engine-api-explorer&QlikTicket='+data.token
      );

  }
  else if(data.target=='SESSION'){

    var ws = new WebSocket(
      qendpoint.qlik_ws+'app/'+s_object.symphonyIntegeratedAppID+'?reloadUri='+qendpoint.qlik_proxy_pt+'dev-hub/engine-api-explorer',
      [],
      {
        'headers': {
          'Cookie': 'X-Qlik-Session-Node='+data.token
        }
      }
      );
  }

  var openNewDoc = e_function.opendoc(1,openDocHandle,s_object.symphonyIntegeratedAppID);
  ws.on('open', function open() {
    ws.send(JSON.stringify(openNewDoc));
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
                  emessage.error_message ='You do not have Symphony BI access';
                  e.status = 403;
                  e.message = emessage;
                  
                  
                  return cb(e)
                }
      var getNewObject = e_function.getobject(2,getObjectHandle,s_object.newBIObjID);
      ws.send(JSON.stringify(getNewObject));
    }
    if(wsres.id==2){
      
      var handle = wsres.result.qReturn.qHandle;
      var rows_height = 12;
      var cloumns_width =9;
      var getNewHypercube = e_function.gethypercube(3,handle,rows_height,cloumns_width);
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
                 //console.log(wsres.result.qDataPages[0].qMatrix[i][6].qText)
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
               var date = new Date();
               console.log('Symphony business insights ',date);
               cb(null,businessInsights);
               businessInsights=[];
                //console.log('Performance Business insights from sesssion');
                
              }
            });


},

extractSymphonydata: function(data,cb) {

  //console.log(data);

  if(data.target=='TICKET'){

    var ws = new WebSocket(
      qendpoint.qlik_ws+'app/'+s_object.symphonyIntegeratedAppID+'?reloadUri='+qendpoint.qlik_proxy_pt+'dev-hub/engine-api-explorer&QlikTicket='+data.token
      );

  }
  else if(data.target=='SESSION'){

    var ws = new WebSocket(
      qendpoint.qlik_ws+'app/'+s_object.symphonyIntegeratedAppID+'?reloadUri='+qendpoint.qlik_proxy_pt+'dev-hub/engine-api-explorer',
      [],
      {
        'headers': {
          'Cookie': 'X-Qlik-Session-Node='+data.token
        }
      }
      );
  }

  var opendocSymphony = e_function.opendoc(1,openDocHandle,s_object.symphonyIntegeratedAppID);
  ws.on('open', function open() {
    ws.send(JSON.stringify(opendocSymphony));
  });

  ws.on('message', function(data, flags) {

    var wsres = JSON.parse(data);
    if(wsres.params && wsres.params.logoutUri == qendpoint.ws_logout+'qps/user'){
                //console.log('user is successfully logged in sales performance with session')
              }
              if(wsres.id==101){
                var getobjectSymphony = e_function.getobject(2,getObjectHandle,s_object.financeDataObjID);
                ws.send(JSON.stringify(getobjectSymphony));
              }
              if(wsres.id==102){
                var handle = wsres.result.qReturn.qHandle;
                var rows_height = 200;
                var cloumns_width =200;
                var gethypercubeSymphony = e_function.gethypercubepivot(3,handle,rows_height,cloumns_width);
                ws.send(JSON.stringify(gethypercubeSymphony));
              }
              if(wsres.id==103){
                if (!wsres.result) {
                  cb(null,{oops:'nodata'});
                  return;
                }
                cb(null,wsres.result);
              }
            });

}

    
};
module.exports = qlik;