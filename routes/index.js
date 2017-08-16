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
var s_extractor = require('./controller/S_deliveryController');
var m_extractor = require('./controller/M_salesController');
var admin = require('./controller/adminController');
var sessionAuthenticator = require('./sessionAuthenticator');


module.exports = function (app) {

//global wrapper services
app.all('*', sessionAuthenticator.validateSession);
app.use('/*/:user_directory/:user_id', admin.saveLogger);
app.get('/getLogCount/:filter', admin.getLogCount);
app.get('/topTwentyLogs', admin.topTwentyLogs);
app.get('/userApplicationCount/:client_id', admin.userApplicationCount);


app.get('/nscr/delivery',delivery.integration_point);

// ************** Node js redirection API ************************
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
app.get('/fetch/business/insights', mjob.extractBI);//bulk data job
app.get('/symphony/data/:user_directory/:user_id', s_extractor.symphonytest);

//************* Optimized merlin web socket services***************************************
app.get('/nscr/qlikoptdata/user/:user_directory/:user_id', m_extractor.qlikdataOptimized);
app.get('/nscr/fetch/salesdata/user/:user_directory/:user_id', m_extractor.qlikSalesdata);
app.get('/nscr/fetch/leaderbd/user/:user_directory/:user_id', m_extractor.qlikLeaderData);
app.get('/nscr/fetch/leaderdeepdive/user/:user_directory/:user_id', m_extractor.qlikLeaderDeepdive);
app.get('/nscr/billingdata/user/:user_directory/:user_id', m_extractor.qlikLeaderBilling);
//************* Optimized Symphony web socket services***************************************
app.get('/nscr/symphonyBIdata/user/:user_directory/:user_id', s_extractor.qlikNewBIData);
app.get('/nscr/finance/user/:user_directory/:user_id', s_extractor.financeData);
app.get('/nscr/value/user/:user_directory/:user_id', s_extractor.valueData);


//******************** Symphony AUTH Service *************************
app.post('/nscr/qlikauth/user/:user_directory/:user_id',delivery.secure_redirection);


//Error handling
app.use(function (err, req, res, next) {
  console.error("ERROR------- ".underline.red, err.stack)
  return res.send({error_id:500 ,error_message:'Something went wrong. Try again in a few moments!!'});
})

};
//I hope this is how comments work in js. Hello Hardik! What's up!!!!