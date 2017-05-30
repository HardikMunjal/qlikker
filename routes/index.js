var request = require('request');
var sys = require('sys');
var open = require("open");
var ejs = require('ejs');
var fs = require('fs');
var qlik = require('./qlik');
var ipsec = require('./ip_securer');
var delivery = require('./delivery');
var mjob = require('./merlin_job2');
var extractor = require('./qlik_extractor_red');
var nano = require('nano')('http://10.112.177.96:5984');
var admin = require('./adminController');

module.exports = function (app) {


// ************** Node js redirection API ************************
app.get('/authenticate', qlik.proxyRedirectFromQlik);
//app.all('/scr/*',ipsec.whitelistIp);


//************* Merlin/HCLIVE AUTH Service ***********************
app.get('/scr/session/user/:user_directory/:user_id', qlik.userExistingSession);
app.get('/scr/ticket/user/:user_directory/:user_id',qlik.userQlikTicket);


//******************** Symphony AUTH Service *************************
app.post('/nscr/qlikauth/user/:user_directory/:user_id',delivery.secure_redirection);
app.get('/nscr/delivery',delivery.integration_point);


//****************** Service not related to merlin,Symphony & HCLLIVE *************************
app.get('/scr/user/list',qlik.getUsersList);
app.get('/fusion/demo',function(req,res){res.render('stacked_chart.ejs');});
app.get('/fusion/demo2',function(req,res){res.render('stacked_chart2.ejs');});


//***************** Unique Session Provider Service ************************* 
app.get('/get/session_id',admin.getSession);
app.get('/user/history/:user_id/:sheet_name',admin.saveHistory);
app.get('/get/history',admin.getHistory);


//***************** Scheduler Services *********************************************
//bulk data job
app.get('/fetch/business/insights', mjob.extractBI);
app.get('/nscr/qlikdata/user/:user_directory/:user_id',extractor.qlikdata);


//************* Optimized merlin web socket services***************************************
app.get('/nscr/qlikoptdata/user/:user_directory/:user_id', extractor.qlikdataOptimized);
app.get('/nscr/symphonyBIdata/user/:user_directory/:user_id', extractor.qlikNewBIData);
app.get('/nscr/fetch/leaderbd/user/:user_directory/:user_id', extractor.qlikLeaderData);
app.get('/nscr/fetch/leaderdeepdive/user/:user_directory/:user_id', extractor.qlikLeaderDeepdive);

//************* Optimized Symphony web socket services***************************************
app.get('/symphony/data/:user_directory/:user_id', extractor.symphonytest);




app.get('/get/mashup_object',admin.mashupDynamiser);



//**************** ADMIN LIVE STREAMING DASHBOARD ************************
app.get('/admin/realtimeplayer',function(req,res){res.render('realtimeplayer.html')})
};
//I hope this is how comments work in js. Hello Hardik! What's up!!!!
