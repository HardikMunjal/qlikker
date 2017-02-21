var request = require('request');
var sys = require('sys');
var open = require("open");
var ejs = require('ejs');
var fs = require('fs');
var qlik = require('./qlik');
var ipsec = require('./ip_securer');
var delivery = require('./delivery');
var mjob = require('./merlin_job');
var extractor = require('./qlik_extractor_red');
module.exports = function (app) {


app.get('/authenticate', qlik.proxyRedirectFromQlik);
//app.all('/scr/*',ipsec.whitelistIp);

app.post('/nscr/qlikauth/user/:user_directory/:user_id',delivery.secure_redirection);
app.get('/scr/session/user/:user_directory/:user_id', qlik.userExistingSession);
app.get('/scr/ticket/user/:user_directory/:user_id',qlik.userQlikTicket);
app.get('/nscr/delivery',delivery.integration_point);
app.get('/scr/user/list',qlik.getUsersList);
app.get('/fusion/demo',function(req,res){res.render('stacked_chart.ejs');});
app.get('/fusion/demo2',function(req,res){res.render('stacked_chart2.ejs');});

//***************** Scheduler Services *********************************************

app.get('/fetch/business/insights', mjob.extractBI);
app.get('/nscr/qlikdata/user/:user_directory/:user_id',extractor.qlikdata);

//************* Optimized web socket services***************************************
app.get('/nscr/qlikoptdata/user/:user_directory/:user_id',extractor.qlikdataOptimized);

};
//I hope this is how comments work in js. Hello Hardik! What's up!!!!
