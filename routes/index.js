var request = require('request');
var sys = require('sys');
var open = require("open");
var ejs = require('ejs');
var fs = require('fs');
var qlik = require('./qlik');
var ipsec = require('./ip_securer');
var shared = require('./shared');
var delivery = require('./delivery');
var mjob = require('./cronjob/merlin_sales_bulkdata');
var extractor = require('./controller/S_deliveryController');
var admin = require('./controller/adminController');
var sessionAuthenticator = require('./sessionAuthenticator');


module.exports = function (app) {

//global wrapper services
app.all('*', sessionAuthenticator.validateSession);
app.use('/*/:user_directory/:user_id', admin.saveLogger);


app.get('/nscr/delivery',delivery.integration_point);

// ************** Node js redirection API ************************

//app.all('*',admin.test)
app.get('/authenticate', qlik.proxyRedirectFromQlik);
//app.all('/scr/*',ipsec.whitelistIp);


//************* Merlin/HCLIVE AUTH Service ***********************
app.get('/scr/session/user/:user_directory/:user_id', qlik.userExistingSession);
app.get('/scr/ticket/user/:user_directory/:user_id', qlik.userQlikTicket);


//****************** Service not related to merlin,Symphony & HCLLIVE *************************
app.get('/scr/user/list',qlik.getUsersList);
app.get('/fusion/demo',function(req,res){res.render('stacked_chart.ejs');});
app.get('/fusion/demo2',function(req,res){res.render('stacked_chart2.ejs');});


//***************** Unique Session Provider Service ************************* 
app.get('/get/session_id',admin.getSession);
app.get('/user/history/:user_id/:sheet_name',admin.saveHistory);
app.get('/get/history',admin.getHistory);

app.get('/performance/test',function(req,res){

	for(var i=0;i<1000000000;i++){
		console.log(i);
	}
})


app.get('/get/mashup_object',admin.mashupDynamiser);
//**************** ADMIN LIVE STREAMING DASHBOARD ************************
app.get('/admin/realtimeplayer',function(req,res){res.render('realtimeplayer.html')})

//***************** Scheduler Services *********************************************
//bulk data job
app.get('/fetch/business/insights', mjob.extractBI);
app.get('/symphony/data/:user_directory/:user_id', extractor.symphonytest);
app.get('/nscr/qlikdata/user/:user_directory/:user_id',extractor.qlikdata);

//************* Optimized merlin web socket services***************************************
app.get('/nscr/qlikoptdata/user/:user_directory/:user_id', extractor.qlikdataOptimized);
app.get('/nscr/fetch/leaderbd/user/:user_directory/:user_id', extractor.qlikLeaderData);
app.get('/nscr/fetch/leaderdeepdive/user/:user_directory/:user_id', extractor.qlikLeaderDeepdive);
//app.get('/nscr/fetch/salesBI/user/:user_directory/:user_id', extractor.qlikSalesdata);
//************* Optimized Symphony web socket services***************************************
app.get('/nscr/symphonyBIdata/user/:user_directory/:user_id', extractor.qlikNewBIData);

app.get('/nscr/finance/user/:user_directory/:user_id', extractor.financeData);
app.get('/nscr/value/user/:user_directory/:user_id', extractor.valueData);


//******************** Symphony AUTH Service *************************
app.post('/nscr/qlikauth/user/:user_directory/:user_id',delivery.secure_redirection);

};
//I hope this is how comments work in js. Hello Hardik! What's up!!!!
