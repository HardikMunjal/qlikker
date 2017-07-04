'use strict';

var qlikauth = require('../../qlik-auth');
var request = require('request');
var ejs = require('ejs');
var fs = require('fs');
var WebSocket = require('ws');
var utility = require('../utility');
var qendpoint = require('../../../config/endpoint');
var s_object = require('../../../config/symphony_object');
var m_object = require('../../../config/merlin_object');
var e_function = require('../../../config/engine_funct');



//var app_id = utility.symphonyDashboardIntegerated;
var app_id = '314889d1-1873-423f-8f6c-57b854f599fb';
var FinanceData = [];

var qlik = {

 
  extractValueData: function(data,cb) {
    
  
  var ws = new WebSocket(
        qendpoint.qlik_ws+'app/314889d1-1873-423f-8f6c-57b854f599fb?reloadUri='+qendpoint.qlik_proxy_pt+'dev-hub/engine-api-explorer&QlikTicket='+data.token
  );

       

    var opendocIntegrated = e_function.opendoc(1,-1, app_id);
    ws.on('open', function open() {
      ws.send(JSON.stringify(opendocIntegrated));
    });

    //**************************** INCOMING MESSAGE EVENT *****************************
    ws.on('message', function(data, flags) {
      
      var wsres = JSON.parse(data);
      console.log(wsres)
      if(wsres.params && wsres.params.logoutUri == qendpoint.ws_logout+'qps/user'){
          //console.log('user is successfully logged in sales performance with session')
      }
      if(wsres.id==1){
        var handle = wsres.result.qReturn.qHandle;
        var getobjectFinance = e_function.getobject(2,handle,"nFcVD");
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
                    valueData.KPIDashBoard.HeadCount.FreshersP=wsres.result.qDataPages[0].qMatrix[0][5].qText;
                    valueData.PCIScore={};
                    valueData.PCIScore.AvgPCI=wsres.result.qDataPages[0].qMatrix[0][24].qText;
                    valueData.PCIScore.NCCount=wsres.result.qDataPages[0].qMatrix[0][25].qText;
                    valueData.PCIScore.PCIRed=wsres.result.qDataPages[0].qMatrix[0][26].qText;
                    valueData.PCIScore.PCIAmber=wsres.result.qDataPages[0].qMatrix[0][27].qText;
                    valueData.PCIScore.PCSATGreen=wsres.result.qDataPages[0].qMatrix[0][28].qText;
                    valueData.PCIScore.PCINC=wsres.result.qDataPages[0].qMatrix[0][0].qText;
                    valueData.PCIScore.QlikURL='http://10.2.5.158:4011/scr/ticket/user/$user_directory/$user_id?client_id=delivery&scope=ticket&open=http://10.2.5.158/node/sense/app/314889d1-1873-423f-8f6c-57b854f599fb/sheet/cHNDfX/state/analysis';
                    valueData.PCIScore.QlikRAGURL='http://10.2.5.158:4011/scr/ticket/user/$user_directory/$user_id?client_id=delivery&scope=ticket&open=http://10.2.5.158/node/extensions/PCIRAGStatus/PCIRAGStatus.html?toggle=ALL';
                    valueData.PCIScore.DataDate=wsres.result.qDataPages[0].qMatrix[0][29].qText;

//dont know what is PCINP
                    valueData.PCSATScore={};
                    valueData.PCSATScore.AvgPCSAT=wsres.result.qDataPages[0].qMatrix[0][13].qText;
                    valueData.PCSATScore.PCSATRed=wsres.result.qDataPages[0].qMatrix[0][17].qText;
                    valueData.PCSATScore.PCSATAmber=wsres.result.qDataPages[0].qMatrix[0][18].qText;
                    valueData.PCSATScore.PCSATGreen=wsres.result.qDataPages[0].qMatrix[0][16].qText;
                    valueData.PCSATScore.PCINP=wsres.result.qDataPages[0].qMatrix[0][0].qText;
                    valueData.PCSATScore.QlikURL='http://10.2.5.158:4011/scr/ticket/user/$user_directory/$user_id?client_id=delivery&scope=ticket&open=http://10.2.5.158/node/sense/app/314889d1-1873-423f-8f6c-57b854f599fb/sheet/KHPDd/state/analysis';
                    valueData.PCSATScore.QlikRAGURL='http://10.2.5.158:4011/scr/ticket/user/$user_directory/$user_id?client_id=delivery&scope=ticket&open=http://10.2.5.158/node/extensions/PCSATRAGStatus/PCSATRAGStatus.html?toggle=ALL';
                    valueData.PCSATScore.DataDate=wsres.result.qDataPages[0].qMatrix[0][19].qText;

                    cb(null,valueData);
                    
                  
            
          }
            });

    //************************** OPEN EVENT *************************************

    
  }

    
};
module.exports = qlik;