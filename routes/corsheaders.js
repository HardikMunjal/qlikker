"use strict";

var allowedHosts = ['http://0.0.0.0:4000','http://swift-dev.drakulaaz.com'];
module.exports = function (req,res,next) {
	console.log('fine');
	console.log(req.headers.origin);
  if(allowedHosts.indexOf(req.headers.origin) > -1){
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
     }
  next();
};  



// earlier i was using this directly in app.js


// app.use('/', function (req, res, next) {
// 	console.log('fine');
//   res.header("Access-Control-Allow-Origin", "http://swift-dev.drakulaaz.com");
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//   res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
//   next();
// });
