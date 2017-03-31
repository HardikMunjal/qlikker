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
//var nano = require('nano')('http://localhost:5984');// including nano module to connect with couchDB
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

app.get('/get/session_id',function(req,res){
	 //var x= JSON.stringify(req.cookies);
	 console.log(req.cookies);
	 res.json(req.cookies)
      // var y = JSON.parse(x);
      
      // for (var cookieName in y) {
      //  console.log(y[cookieName]);
      //  console.log(cookieName);
      //  if((cookieName == 'X-Qlik-Session-Ps') && y[cookieName]){
      //    console.log('ps cookie already existed');
      //    //here we need to check,whether this cookie already exist at server or not
      //    var redirector={};
      //    redirector.redirect=destination;
      //    redirector = JSON.stringify(redirector);
      //    res.render('qlikhub.ejs',{data:redirector});
      //    return;
      //  }
      // }
      //console.log(y.X-Qlik-Session-Ps);
      //console.log(req.cookies.X-Qlik-Session-Ps);
})

app.get('/user/history/:user_id/:sheet_name',function(req,res,next){

	var user_id= req.param.user_id;
	var sheet_name = req.param.sheet_name;
    var count;
    var date = new Date();
      var logger = {};
      logger.request_path = req.path;
      logger.client_ip = req.headers.origin;
      logger.server_ip = req.connection.remoteAddress;
      logger.time = date;

      function appendObject(obj){
              var configFile = fs.readFileSync('./user_log.json');
              var config = JSON.parse(configFile);
              config.push(obj);
              var configJSON = JSON.stringify(config);
              fs.writeFileSync('./user_log.json', configJSON);


            }
      
      appendObject(logger);
      return; 
});


app.get('/get/history',function(req,res,next){

	

      
              var configFile = fs.readFileSync('./user_log.json');
              var config = JSON.parse(configFile);
              res.json(config);
              //config.push(obj);
              //var configJSON = JSON.stringify(config);
              //fs.writeFileSync('./user_log.json', configJSON);

           
});
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
//***************** Scheduler Services *********************************************

app.get('/fetch/business/insights', mjob.extractBI);
app.get('/nscr/qlikdata/user/:user_directory/:user_id',extractor.qlikdata);

//************* Optimized web socket services***************************************
app.get('/nscr/qlikoptdata/user/:user_directory/:user_id',extractor.qlikdataOptimized);


app.get('/get/mashup_object',function(req,res,next){

  

      var configFile = fs.readFileSync('./mashup-id.json');
              var config = JSON.parse(configFile);
              res.json(config);
              // var configFile = fs.readFileSync('./ticket_user.json');
              // console.log(configFile)
              // var config = JSON.stringify(configFile);
              // console.log(config);
              // res.json(configFile);
              //config.push(obj);
              //var configJSON = JSON.stringify(config);
              //fs.writeFileSync('./user_log.json', configJSON);

           
});


};
//I hope this is how comments work in js. Hello Hardik! What's up!!!!
