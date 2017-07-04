'use strict';
var request = require('request');
var ejs = require('ejs');
var qendpoint = require('../config/endpoint');


module.exports.validateSession = function(req, res, next) {
	console.log("in validateSession-- ", req.query);

  if(req.query.LC && req.query.DI && req.query.ET && req.query.ST){

  	var uri = 'http://staging2.myhcl.com//myhclmobileapi/api/validate/'+req.query.ST+'/'+req.query.DI+'/'+req.query.ET+'/'+req.query.LC;
  	uri = encodeURI(uri);

	request({
	    headers: {
	      'Content-Type': 'application/json'
	    },
	    uri: uri,
	    method: 'GET'
	  },  function (error, response, body){
	  	var result = JSON.parse(body);
	  	console.log("validateSession body--- ", body);
	  	 	if(result.result){
	  	 		if(req.params.user_id == req.query.LC){
	  	 			next();
	  	 		}else{
	  	 			request('http://staging2.myhcl.com/MyApprovalsMobile2/Common/ValidateAdmin?username='+req.query.LC, function(error, response, body){
	  	 				
	  	 				var body = JSON.parse(body);
	  	 				console.log("body of IsValid--- ", body.IsValid);
	  	 				if(!error && body.IsValid == 'N'){
	  	 					res.send({message:"Slow down tiger!! You are not authorized to perform this action."})
	  	 				}else if(body.IsValid == 'Y'){
	  	 					next();
	  	 				}else{
	  	 					res.send({message:"There is some error!! Please try again later."})
	  	 				}
	  	 			})
	  	 		}
	  	 	}else{
	  	 		console.log("Session error");
	  	 		res.send({message:"Session Error."})
	  	 	}
	})
  }else{
  	console.log("in else");
  	res.send({message: "Error!! You are missing something."})
  }
}