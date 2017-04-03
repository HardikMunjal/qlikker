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


app.get('/authenticate', qlik.proxyRedirectFromQlik);
//app.all('/scr/*',ipsec.whitelistIp);
app.post('/nscr/qlikauth/user/:user_directory/:user_id',delivery.secure_redirection);
app.get('/scr/session/user/:user_directory/:user_id', qlik.userExistingSession);
app.get('/scr/ticket/user/:user_directory/:user_id',qlik.userQlikTicket);
app.get('/nscr/delivery',delivery.integration_point);
app.get('/scr/user/list',qlik.getUsersList);
app.get('/fusion/demo',function(req,res){res.render('stacked_chart.ejs');});
app.get('/fusion/demo2',function(req,res){res.render('stacked_chart2.ejs');});
app.get('/get/session_id',admin.getSession);
app.get('/user/history/:user_id/:sheet_name',admin.saveHistory);
app.get('/get/history',admin.getHistory);
//***************** Scheduler Services *********************************************
app.get('/fetch/business/insights', mjob.extractBI);
app.get('/nscr/qlikdata/user/:user_directory/:user_id',extractor.qlikdata);

//************* Optimized web socket services***************************************
app.get('/nscr/qlikoptdata/user/:user_directory/:user_id',extractor.qlikdataOptimized);
app.get('/get/mashup_object',admin.mashupDynamiser);



/*
//http://localhost:5984/_utils/#database/users/_all_docs
app.get('/testing/couch', function(req,res,next){
	var user_ids = ['u1', 'u2', 'u3', 'u4','u5'];
	var users = nano.use('users');
	// user_ids.forEach(function(element) {
	// 	var date = new Date();
	// 	var d=date.getDate();
	// 	var m=date.getMonth()+1;
	// 	var y=date.getFullYear();
	// 	var h=date.getHours(); 
	// 	var mi=date.getMinutes(); 
	// 	var s=date.getSeconds();
	// 	var dateTime=d+'/'+m+'/'+y+' '+h+':'+mi+':'+s;
	//     console.log(element);
	//     users.insert({ name: element,user_directory: 'hcltech', date_n_time: dateTime, path: 'ticket', client:'merlin', scope: 'pipline data' }, element, function(err) {  
	// 	  if (err && err.statusCode != 412) {
	// 	    console.error(err);
	// 	  }
	// 	  else {
	// 	    console.log('document exists');
	// 	  }
 //  		});
	// });

	//fetch multiple documents
	users.fetch({keys: ["u1", "u2", "u3"]}, function(err, body) {
		var names = body.rows.map(function(row) {
		return row.doc.names;
		});

	});
	
// and insert a document in it 
     
  // users

  // name "praveen"
  // user_directory "hcltech"
  // time  3:58pm
  // path  :"/ticket"
  // client: "merlin"
  // scope: "pipeline data"


});
*/

};
//I hope this is how comments work in js. Hello Hardik! What's up!!!!
