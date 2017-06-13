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

  extractFinanceData: function(data,cb) {
    
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
        var getobjectFinance = e_function.getobject(2,handle,"TqWcn");
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

                      financeData.Finance.DataDate='APR-2017';
                      financeData.Finance.QlikURL='http://10.2.5.158:4011/scr/ticket/user/HCLISD/gauravsai?client_id=delivery&scope=ticket&open=http://10.2.5.158/node/single/?appid=3e15860c-78bd-4e82-99a7-a4877f5a2305&obj=vnGsG&select=clearall'
                      financeData.Finance.Data=[];

                      var yearend = {}

                      yearend.FY='2017';
                      yearend.Revenue= wsres.result.qDataPages[0].qMatrix[0][0].qText;
                      yearend.ProjectMargin= wsres.result.qDataPages[0].qMatrix[0][1].qText;
                      yearend.Resource= wsres.result.qDataPages[0].qMatrix[0][2].qText;
                      yearend.Travel= wsres.result.qDataPages[0].qMatrix[0][4].qText;
                      yearend.Project= wsres.result.qDataPages[0].qMatrix[0][3].qText;
                      
                      var monthend = {}
                      monthend.FY='2017';
                      monthend.Revenue= wsres.result.qDataPages[0].qMatrix[0][9].qText;
                      monthend.ProjectMargin= wsres.result.qDataPages[0].qMatrix[0][10].qText;
                      monthend.Resource= wsres.result.qDataPages[0].qMatrix[0][11].qText;
                      monthend.Travel= wsres.result.qDataPages[0].qMatrix[0][13].qText;
                      monthend.Project= wsres.result.qDataPages[0].qMatrix[0][12].qText;


                      financeData.Finance.Data.push(yearend);
                      financeData.Finance.Data.push(monthend);

                      financeData.ValueCreation = {};
                      financeData.ValueCreation.ValueDelivered = wsres.result.qDataPages[0].qMatrix[0][5].qText;
                      financeData.ValueCreation.IdeaGenerated= wsres.result.qDataPages[0].qMatrix[0][6].qText;

                      financeData.ValueCreation.IdeaImplemented= wsres.result.qDataPages[0].qMatrix[0][7].qText;
                      financeData.ValueCreation.QlikURL = 'http://10.2.5.158:4011/scr/ticket/user/HCLISD/gauravsai?client_id=delivery&scope=ticket&open=http://10.2.5.158/node/single/?appid=3e15860c-78bd-4e82-99a7-a4877f5a2305&obj=vnGsG&select=clearall';


                   cb(null,financeData);
                   //businessInsights=[];
                    //console.log('Performance Business insights from sesssion');
                    
                  }
            });

    //************************** OPEN EVENT *************************************

    
  }
};
module.exports = qlik;