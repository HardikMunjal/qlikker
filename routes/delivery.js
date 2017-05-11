'use strict';

var qlikauth = require('./qlik-auth');
var request = require('request');
var ejs = require('ejs');
var fs = require('fs');
var deliveryProtectionPassword = 'aEd43rTYu4erTxcfTrER';
var qendpoint = require('../config/endpoint');



var qlik = {


secure_redirection: function(req, res, next) {

    console.log(req.body.client_secret);
    if(!req.body.client_secret ){

    res.send("Client Secret is required");
    return;
    }

    if(req.body.client_secret != deliveryProtectionPassword){

    res.send("Wrong Client Secret");
    return;
    }
    if(!req.query.scope ){

    res.send("Scope is required");
    return;
    }
    if(req.query.scope != 'ticket' && req.query.scope  != 'session'){

    res.send("Invalid Scope");
    return;
    }


    if(req.query.scope == 'ticket'){
    request(qendpoint.qlik_pt+'scr/ticket/user/'+req.params.user_directory+'/'+req.params.user_id+'?client_id=delivery&scope=ticket', function (error, response, body) {
      
          if (!error) {
            
            res.send(body);
            return;  
         }
        });
    }


    if(req.query.scope == 'session'){
    request(qendpoint.qlik_pt+'scr/session/user/'+req.params.user_directory+'/'+req.params.user_id+'?client_id=delivery&scope=session', function (error, response, body) {
      
          if (!error) {
            
            res.send(body);
            return;  
         }
        });
    }


      },

integration_point : function(req, res, next) {




    
var ValueDeliveredSym = [] ;

var R1Map = ['L1','L2','L3','L4'];
var R2Map = ['PM','SPM','PortfolioDirector','ProgramManager','ProgramDirector','ServiceDeliveryManager','PMO'];


  // Delivery App Configuration
  var symphonyApp ={};
     
    symphonyApp.app_id = "314889d1-1873-423f-8f6c-57b854f599fb";
    symphonyApp.app_name = "Persona Wise Symphony Dashboard" ;
    symphonyApp.web_socket_url = qendpoint.qlik_ws+'app/314889d1-1873-423f-8f6c-57b854f599fb?reloadUri='+qendpoint.qlik_proxy_pt+"dev-hub/engine-api-explorer"
    symphonyApp.group_details =[];
  
    //Pivot chart for #CD1 data monthly wise 
    var pivotTablePhase1 ={}
    pivotTablePhase1.object_no =1;
    pivotTablePhase1.object_id = "nGtzs";
    pivotTablePhase1.object_type = "pivot";
    pivotTablePhase1.scope = "data" ;
    pivotTablePhase1.groupDeepDive = "";

    pivotTablePhase1.children = [ {id: 101 , name: "Revenue" , scope :"data" ,deepdive : qendpoint.qlik_pt+"scr/ticket/user/$user_directory/$user_id?client_id=delivery&scope=ticket&open="+qendpoint.qlik_proxy_pt+"extensions/FinanceSummaryCD3/FinanceSummaryCD3.html?view=YTD"},
                {id: 102 , name: "Project Margin" , scope :"data" ,deepdive : qendpoint.qlik_pt+"scr/ticket/user/$user_directory/$user_id?client_id=delivery&scope=ticket&open="+qendpoint.qlik_proxy_pt+"extensions/FinanceSummaryCD3/FinanceSummaryCD3.html?view=YTD"},
                {id:  103 , name: "Resource Expense" , scope :"data" ,deepdive : qendpoint.qlik_pt+"scr/ticket/user/$user_directory/$user_id?client_id=delivery&scope=ticket&open="+qendpoint.qlik_proxy_pt+"extensions/ExpenseResourceCD3/ExpenseResourceCD3.html"},
                {id: 104 , name: "Project Expense" , scope :"data" ,deepdive : qendpoint.qlik_pt+"scr/ticket/user/$user_directory/$user_id?client_id=delivery&scope=ticket&open="+qendpoint.qlik_proxy_pt+"extensions/ExpenseResourceCD3/ExpenseResourceCD3.html"},
                {id: 105 , name: "Travel Expense" , scope :"data" ,deepdive : qendpoint.qlik_pt+"scr/ticket/user/$user_directory/$user_id?client_id=delivery&scope=ticket&open="+qendpoint.qlik_proxy_pt+"extensions/ExpenseResourceCD3/ExpenseResourceCD3.html"},
                {id: 106 , name: "Value Delivered" , scope :"data" ,deepdive : qendpoint.qlik_pt+"scr/ticket/user/$user_directory/$user_id?client_id=delivery&scope=ticket&open="+qendpoint.qlik_proxy_pt+"extensions/ValueCreationCD3/ValueCreationCD3.html?view=YTD"},
                {id: 107 , name: "Idea Generated" , scope :"data" ,deepdive : qendpoint.qlik_pt+"scr/ticket/user/$user_directory/$user_id?client_id=delivery&scope=ticket&open="+qendpoint.qlik_proxy_pt+"extensions/ValueCreationCD3/ValueCreationCD3.html?view=YTD"},
                {id:  108 , name: "Idea Implemented" , scope :"data" ,deepdive : qendpoint.qlik_pt+"scr/ticket/user/$user_directory/$user_id?client_id=delivery&scope=ticket&open="+qendpoint.qlik_proxy_pt+"extensions/ValueCreationCD3/ValueCreationCD3.html?view=YTD"} ];
    symphonyApp.group_details.push(pivotTablePhase1);


    // Pivot chart for value creation data
    var pivotTablePhase2 ={}
    pivotTablePhase2.object_no =2;
    pivotTablePhase2.object_id = "nFcVD";
    pivotTablePhase2.object_type = "sheet";
    pivotTablePhase2.scope = "HR" ;
    pivotTablePhase2.groupDeepDive = qendpoint.qlik_pt+"scr/ticket/user/$user_directory/$user_id?client_id=delivery&scope=ticket&open="+qendpoint.qlik_proxy_pt+"extensions/HumanResourceCD3/HumanResourceCD3.html?toggle=1";
    pivotTablePhase2.children = [];
    symphonyApp.group_details.push(pivotTablePhase2);

    var pivotTablePhase3 ={}
    
    pivotTablePhase3.object_no =3;
    pivotTablePhase3.object_id = "kufpa";
    pivotTablePhase3.object_type = "textbox";
    pivotTablePhase3.scope = "Business Insight" ;
    pivotTablePhase3.groupDeepDive = [];
    pivotTablePhase3.children = [ {id: 109 , name: "MarginDepletionBI" , scope :"Business Insights" ,deepdive : qendpoint.qlik_pt+"scr/ticket/user/$user_directory/$user_id?client_id=delivery&scope=ticket&open="+qendpoint.qlik_proxy_pt+"extensions/BussinessInsightsR1/BussinessInsightsR1.html?view=YTD"}]

    symphonyApp.group_details.push(pivotTablePhase3);

    // Pivot chart for value creation data
    var pivotTablePhase4 ={}
    pivotTablePhase4.object_no =2;
    pivotTablePhase4.object_id = "nFcVD";
    pivotTablePhase4.object_type = "mashup";
    pivotTablePhase4.scope = "PCI" ;
    pivotTablePhase4.groupDeepDive = qendpoint.qlik_pt+"scr/ticket/user/$user_directory/$user_id?client_id=delivery&scope=ticket&open="+qendpoint.qlik_proxy_pt+"extensions/PCIRAGStatus/PCIRAGStatus.html?toggle=ALL";
    pivotTablePhase4.children = [];
    symphonyApp.group_details.push(pivotTablePhase4);


    // Pivot chart for value creation data
    var pivotTablePhase5 ={}
    pivotTablePhase5.object_no =2;
    pivotTablePhase5.object_id = "nFcVD";
    pivotTablePhase5.object_type = "mashup";
    pivotTablePhase5.scope = "PCSAT" ;
    pivotTablePhase5.groupDeepDive = qendpoint.qlik_pt+"scr/ticket/user/$user_directory/$user_id?client_id=delivery&scope=ticket&open="+qendpoint.qlik_proxy_pt+"extensions/PCSATRAGStatus/PCSATRAGStatus.html?toggle=ALL";
    pivotTablePhase5.children = [];
    symphonyApp.group_details.push(pivotTablePhase5);


    var pivotTablePhase6 ={}
    pivotTablePhase6.object_no =2;
    pivotTablePhase6.object_id = "null";
    pivotTablePhase6.object_type = "sheet";
    pivotTablePhase6.scope = "PCSAT-sheet" ;
    pivotTablePhase6.groupDeepDive = qendpoint.qlik_pt+"scr/ticket/user/$user_directory/$user_id?client_id=delivery&scope=ticket&open="+qendpoint.qlik_proxy_pt+"sense/app/314889d1-1873-423f-8f6c-57b854f599fb/sheet/KHPDd/state/analysis";
    pivotTablePhase6.children = [];
    symphonyApp.group_details.push(pivotTablePhase6);

    var pivotTablePhase7 ={}
    pivotTablePhase7.object_no =2;
    pivotTablePhase7.object_id = "null";
    pivotTablePhase7.object_type = "mashup";
    pivotTablePhase7.scope = "PCI-sheet" ;
    pivotTablePhase7.groupDeepDive = qendpoint.qlik_pt+"scr/ticket/user/$user_directory/$user_id?client_id=delivery&scope=ticket&open="+qendpoint.qlik_proxy_pt+"sense/app/314889d1-1873-423f-8f6c-57b854f599fb/sheet/cHNDfX/state/analysis";
    pivotTablePhase7.children = [];
    symphonyApp.group_details.push(pivotTablePhase7);



  
ValueDeliveredSym.push(symphonyApp);
res.send(ValueDeliveredSym);
}


};
module.exports = qlik;