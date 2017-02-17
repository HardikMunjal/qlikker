'use strict';

var qlikauth = require('./qlik-auth');
var request = require('request');
var ejs = require('ejs');
var fs = require('fs');
var deliveryProtectionPassword = 'aEd43rTYu4erTxcfTrER';



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
request('http://10.2.5.160:4011/scr/ticket/user/'+req.params.user_directory+'/'+req.params.user_id+'?client_id=delivery&scope=ticket', function (error, response, body) {
  
      if (!error) {
        
        res.send(body);
        return;  
     }
    });
}


if(req.query.scope == 'session'){
request('http://10.2.5.160:4011/scr/session/user/'+req.params.user_directory+'/'+req.params.user_id+'?client_id=delivery&scope=session', function (error, response, body) {
  
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
  

  
  
  if(req.query.role_name && R1Map.indexOf('L1') > -1){
     
    symphonyApp.app_id = "bf5331a1-391c-4cfe-a029-4d0fc49444f4";
    symphonyApp.app_name = "Persona Wise Symphony Dashboard" ;
    symphonyApp.web_socket_url = "ws://10.2.5.160/ps/app/bf5331a1-391c-4cfe-a029-4d0fc49444f4?reloadUri=http://10.2.5.160/ps/dev-hub/engine-api-explorer"
    symphonyApp.group_details =[];
    
    //Pivot chart for #CD1 data monthly wise 
    var pivotTablePhase1 ={}
    pivotTablePhase1.object_no =1;
    pivotTablePhase1.object_id = "QSEeySq";
    pivotTablePhase1.object_type = "pivot";
    pivotTablePhase1.scope = "data" ;
    pivotTablePhase1.groupDeepDive = "";

    pivotTablePhase1.children = [ {id: 101 , name: "Revenue" , scope :"data" ,deepdive : "http://10.2.5.160:4011/scr/ticket/user/$user_directory/$user_id?client_id=delivery&scope=ticket&open=http://10.2.5.160/ps/extensions/FinanceSummaryR1/FinanceSummaryR1.html?view=YTD"},
                {id: 102 , name: "Project Margin" , scope :"data" ,deepdive : "http://10.2.5.160:4011/scr/ticket/user/$user_directory/$user_id?client_id=delivery&scope=ticket&open=http://10.2.5.160/ps/extensions/FinanceSummaryR1/FinanceSummaryR1.html?view=YTD"},
                {id:  103 , name: "Resource Expense" , scope :"data" ,deepdive : "http://10.2.5.160:4011/scr/ticket/user/$user_directory/$user_id?client_id=delivery&scope=ticket&open=http://10.2.5.160/ps/sense/app/bf5331a1-391c-4cfe-a029-4d0fc49444f4/sheet/57b6dbae-b7e2-420b-94e6-78fe12dbd8dc/state/analysis"},
                {id: 104 , name: "Project Expense" , scope :"data" ,deepdive : "http://10.2.5.160:4011/scr/ticket/user/$user_directory/$user_id?client_id=delivery&scope=ticket&open=http://10.2.5.160/ps/sense/app/bf5331a1-391c-4cfe-a029-4d0fc49444f4/sheet/57b6dbae-b7e2-420b-94e6-78fe12dbd8dc/state/analysis"},
                {id: 105 , name: "Travel Expense" , scope :"data" ,deepdive : "http://10.2.5.160:4011/scr/ticket/user/$user_directory/$user_id?client_id=delivery&scope=ticket&open=http://10.2.5.160/ps/sense/app/bf5331a1-391c-4cfe-a029-4d0fc49444f4/sheet/57b6dbae-b7e2-420b-94e6-78fe12dbd8dc/state/analysis"},
                {id: 106 , name: "Value Delivered" , scope :"data" ,deepdive : "http://10.2.5.160:4011/scr/ticket/user/$user_directory/$user_id?client_id=delivery&scope=ticket&open=http://10.2.5.160/ps/extensions/ValueCreationR1/ValueCreationR1.html?view=YTD"},
                {id: 107 , name: "Idea Generated" , scope :"data" ,deepdive : "http://10.2.5.160:4011/scr/ticket/user/$user_directory/$user_id?client_id=delivery&scope=ticket&open=http://10.2.5.160/ps/extensions/ValueCreationR1/ValueCreationR1.html?view=YTD"},
                {id:  108 , name: "Idea Implemented" , scope :"data" ,deepdive : "http://10.2.5.160:4011/scr/ticket/user/$user_directory/$user_id?client_id=delivery&scope=ticket&open=http://10.2.5.160/ps/extensions/ValueCreationR1/ValueCreationR1.html?view=YTD"} ];
    symphonyApp.group_details.push(pivotTablePhase1);


    // Pivot chart for value creation data
    var pivotTablePhase2 ={}
    pivotTablePhase2.object_no =2;
    pivotTablePhase2.object_id = "6e8fbe6c-a99e-438e-ba3c-a51a5378263b";
    pivotTablePhase2.object_type = "sheet";
    pivotTablePhase2.scope = "HR" ;
    pivotTablePhase2.groupDeepDive = "http://10.2.5.160:4011/scr/ticket/user/$user_directory/$user_id?client_id=delivery&scope=ticket&open=http://10.2.5.160/ps/extensions/HumanResourceR1/HumanResourceR1.html";
    pivotTablePhase2.children = [];
    symphonyApp.group_details.push(pivotTablePhase2);

    var pivotTablePhase3 ={}
    
    pivotTablePhase3.object_no =3;
    pivotTablePhase3.object_id = "pFhhS";
    pivotTablePhase3.object_type = "textbox";
    pivotTablePhase3.scope = "Business Insight" ;
    pivotTablePhase3.groupDeepDive = [];
    pivotTablePhase3.children = [ {id: 109 , name: "MarginDepletionBI" , scope :"Business Insights" ,deepdive : "http://10.2.5.160:4011/scr/ticket/user/$user_directory/$user_id?client_id=delivery&scope=ticket&open=http://10.2.5.160/ps/extensions/BussinessInsightsR1/BussinessInsightsR1.html?view=YTD"}]

    symphonyApp.group_details.push(pivotTablePhase3);


    }
    else if(req.query.role_name && R2Map.indexOf(req.query.role_name) > -1){


    symphonyApp.app_id = "bf5331a1-391c-4cfe-a029-4d0fc49444f4";
    symphonyApp.app_name = "Persona Wise Symphony Dashboard" ;
    symphonyApp.web_socket_url = "ws://10.2.5.160/ps/app/bf5331a1-391c-4cfe-a029-4d0fc49444f4?reloadUri=http://10.2.5.160/ps/dev-hub/engine-api-explorer"
    symphonyApp.group_details =[];
  
    //Pivot chart for #CD1 data monthly wise 
    var pivotTablePhase1 ={}
    pivotTablePhase1.object_no =1;
    pivotTablePhase1.object_id = "QSEeySq";
    pivotTablePhase1.object_type = "pivot";
    pivotTablePhase1.scope = "data" ;
    pivotTablePhase1.groupDeepDive = "";

    pivotTablePhase1.children = [ {id: 101 , name: "Revenue" , scope :"data" ,deepdive : "http://10.2.5.160:4011/scr/ticket/user/$user_directory/$user_id?client_id=delivery&scope=ticket&open=http://10.2.5.160/ps/extensions/FinanceSummaryR2/FinanceSummaryR1.html?view=YTD"},
                {id: 102 , name: "Project Margin" , scope :"data" ,deepdive : "http://10.2.5.160:4011/scr/ticket/user/$user_directory/$user_id?client_id=delivery&scope=ticket&open=http://10.2.5.160/ps/extensions/FinanceSummaryR1/FinanceSummaryR1.html?view=YTD"},
                {id:  103 , name: "Resource Expense" , scope :"data" ,deepdive : "http://10.2.5.160:4011/scr/ticket/user/$user_directory/$user_id?client_id=delivery&scope=ticket&open=http://10.2.5.160/ps/sense/app/bf5331a1-391c-4cfe-a029-4d0fc49444f4/sheet/57b6dbae-b7e2-420b-94e6-78fe12dbd8dc/state/analysis"},
                {id: 104 , name: "Project Expense" , scope :"data" ,deepdive : "http://10.2.5.160:4011/scr/ticket/user/$user_directory/$user_id?client_id=delivery&scope=ticket&open=http://10.2.5.160/ps/sense/app/bf5331a1-391c-4cfe-a029-4d0fc49444f4/sheet/57b6dbae-b7e2-420b-94e6-78fe12dbd8dc/state/analysis"},
                {id: 105 , name: "Travel Expense" , scope :"data" ,deepdive : "http://10.2.5.160:4011/scr/ticket/user/$user_directory/$user_id?client_id=delivery&scope=ticket&open=http://10.2.5.160/ps/sense/app/bf5331a1-391c-4cfe-a029-4d0fc49444f4/sheet/57b6dbae-b7e2-420b-94e6-78fe12dbd8dc/state/analysis"},
                {id: 106 , name: "Value Delivered" , scope :"data" ,deepdive : "http://10.2.5.160:4011/scr/ticket/user/$user_directory/$user_id?client_id=delivery&scope=ticket&open=http://10.2.5.160/ps/extensions/ValueCreationR1/ValueCreationR1.html?view=YTD"},
                {id: 107 , name: "Idea Generated" , scope :"data" ,deepdive : "http://10.2.5.160:4011/scr/ticket/user/$user_directory/$user_id?client_id=delivery&scope=ticket&open=http://10.2.5.160/ps/extensions/ValueCreationR1/ValueCreationR1.html?view=YTD"},
                {id:  108 , name: "Idea Implemented" , scope :"data" ,deepdive : "http://10.2.5.160:4011/scr/ticket/user/$user_directory/$user_id?client_id=delivery&scope=ticket&open=http://10.2.5.160/ps/extensions/ValueCreationR1/ValueCreationR1.html?view=YTD"} ];
    symphonyApp.group_details.push(pivotTablePhase1);


    // Pivot chart for value creation data
    var pivotTablePhase2 ={}
    pivotTablePhase2.object_no =2;
    pivotTablePhase2.object_id = "6e8fbe6c-a99e-438e-ba3c-a51a5378263b";
    pivotTablePhase2.object_type = "sheet";
    pivotTablePhase2.scope = "HR" ;
    pivotTablePhase2.groupDeepDive = "http://10.2.5.160:4011/scr/ticket/user/$user_directory/$user_id?client_id=delivery&scope=ticket&open=http://10.2.5.160/ps/extensions/HumanResourceR1/HumanResourceR1.html";
    pivotTablePhase2.children = [];
    symphonyApp.group_details.push(pivotTablePhase2);

    var pivotTablePhase3 ={}
    
    pivotTablePhase3.object_no =3;
    pivotTablePhase3.object_id = "pFhhS";
    pivotTablePhase3.object_type = "textbox";
    pivotTablePhase3.scope = "Business Insight" ;
    pivotTablePhase3.groupDeepDive = [];
    pivotTablePhase3.children = [ {id: 109 , name: "MarginDepletionBI" , scope :"Business Insights" ,deepdive : "http://10.2.5.160:4011/scr/ticket/user/$user_directory/$user_id?client_id=delivery&scope=ticket&open=http://10.2.5.160/ps/extensions/BussinessInsightsR1/BussinessInsightsR1.html?view=YTD"}]

    symphonyApp.group_details.push(pivotTablePhase3);


    }
    else if(!req.query.role_name) {
     
    symphonyApp.app_id = "bf5331a1-391c-4cfe-a029-4d0fc49444f4";
    symphonyApp.app_name = "Persona Wise Symphony Dashboard" ;
    symphonyApp.web_socket_url = "ws://10.2.5.160/ps/app/bf5331a1-391c-4cfe-a029-4d0fc49444f4?reloadUri=http://10.2.5.160/ps/dev-hub/engine-api-explorer"
    symphonyApp.group_details =[];
  
    //Pivot chart for #CD1 data monthly wise 
    var pivotTablePhase1 ={}
    pivotTablePhase1.object_no =1;
    pivotTablePhase1.object_id = "QSEeySq";
    pivotTablePhase1.object_type = "pivot";
    pivotTablePhase1.scope = "data" ;
    pivotTablePhase1.groupDeepDive = "";

    pivotTablePhase1.children = [ {id: 101 , name: "Revenue" , scope :"data" ,deepdive : "http://10.2.5.160:4011/scr/ticket/user/$user_directory/$user_id?client_id=delivery&scope=ticket&open=http://10.2.5.160/ps/extensions/FinanceSummaryR2/FinanceSummaryR1.html?view=YTD"},
                {id: 102 , name: "Project Margin" , scope :"data" ,deepdive : "http://10.2.5.160:4011/scr/ticket/user/$user_directory/$user_id?client_id=delivery&scope=ticket&open=http://10.2.5.160/ps/extensions/FinanceSummaryR1/FinanceSummaryR1.html?view=YTD"},
                {id:  103 , name: "Resource Expense" , scope :"data" ,deepdive : "http://10.2.5.160:4011/scr/ticket/user/$user_directory/$user_id?client_id=delivery&scope=ticket&open=http://10.2.5.160/ps/sense/app/bf5331a1-391c-4cfe-a029-4d0fc49444f4/sheet/57b6dbae-b7e2-420b-94e6-78fe12dbd8dc/state/analysis"},
                {id: 104 , name: "Project Expense" , scope :"data" ,deepdive : "http://10.2.5.160:4011/scr/ticket/user/$user_directory/$user_id?client_id=delivery&scope=ticket&open=http://10.2.5.160/ps/sense/app/bf5331a1-391c-4cfe-a029-4d0fc49444f4/sheet/57b6dbae-b7e2-420b-94e6-78fe12dbd8dc/state/analysis"},
                {id: 105 , name: "Travel Expense" , scope :"data" ,deepdive : "http://10.2.5.160:4011/scr/ticket/user/$user_directory/$user_id?client_id=delivery&scope=ticket&open=http://10.2.5.160/ps/sense/app/bf5331a1-391c-4cfe-a029-4d0fc49444f4/sheet/57b6dbae-b7e2-420b-94e6-78fe12dbd8dc/state/analysis"},
                {id: 106 , name: "Value Delivered" , scope :"data" ,deepdive : "http://10.2.5.160:4011/scr/ticket/user/$user_directory/$user_id?client_id=delivery&scope=ticket&open=http://10.2.5.160/ps/extensions/ValueCreationR1/ValueCreationR1.html?view=YTD"},
                {id: 107 , name: "Idea Generated" , scope :"data" ,deepdive : "http://10.2.5.160:4011/scr/ticket/user/$user_directory/$user_id?client_id=delivery&scope=ticket&open=http://10.2.5.160/ps/extensions/ValueCreationR1/ValueCreationR1.html?view=YTD"},
                {id:  108 , name: "Idea Implemented" , scope :"data" ,deepdive : "http://10.2.5.160:4011/scr/ticket/user/$user_directory/$user_id?client_id=delivery&scope=ticket&open=http://10.2.5.160/ps/extensions/ValueCreationR1/ValueCreationR1.html?view=YTD"} ];
    symphonyApp.group_details.push(pivotTablePhase1);


    // Pivot chart for value creation data
    var pivotTablePhase2 ={}
    pivotTablePhase2.object_no =2;
    pivotTablePhase2.object_id = "6e8fbe6c-a99e-438e-ba3c-a51a5378263b";
    pivotTablePhase2.object_type = "sheet";
    pivotTablePhase2.scope = "HR" ;
    pivotTablePhase2.groupDeepDive = "http://10.2.5.160:4011/scr/ticket/user/$user_directory/$user_id?client_id=delivery&scope=ticket&open=http://10.2.5.160/ps/extensions/HumanResourceR1/HumanResourceR1.html";
    pivotTablePhase2.children = [];
    symphonyApp.group_details.push(pivotTablePhase2);

    var pivotTablePhase3 ={}
    
    pivotTablePhase3.object_no =3;
    pivotTablePhase3.object_id = "pFhhS";
    pivotTablePhase3.object_type = "textbox";
    pivotTablePhase3.scope = "Business Insight" ;
    pivotTablePhase3.groupDeepDive = [];
    pivotTablePhase3.children = [ {id: 109 , name: "MarginDepletionBI" , scope :"Business Insights" ,deepdive : "http://10.2.5.160:4011/scr/ticket/user/$user_directory/$user_id?client_id=delivery&scope=ticket&open=http://10.2.5.160/ps/extensions/BussinessInsightsR1/BussinessInsightsR1.html?view=YTD"}]

    symphonyApp.group_details.push(pivotTablePhase3);


    }

  
ValueDeliveredSym.push(symphonyApp);

res.send(ValueDeliveredSym);

}


};
module.exports = qlik;