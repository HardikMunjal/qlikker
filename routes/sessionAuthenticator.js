'use strict';
var request = require('request');
var colors = require('colors');


module.exports.validateSession = function(req, res, next) {
    
    var creator= req.params['0'];

   if(creator.indexOf('nscr')>-1 && creator.indexOf('fetch')>-1 && creator.indexOf('user/')>-1){
   	console.log("This will go for validation wrapper".inverse)
    var required= creator.lastIndexOf("user/");
    var dual=creator.substring(required+5);

    var user_directory = dual.substring(0,dual.indexOf('/'));
    var user_id = dual.substring(dual.indexOf('/')+1);
   }
   else{
   	console.log("This is not a nscr service.".inverse)
   	next();
   	return;
   }

  if(req.query.LC && req.query.DI && req.query.ET && req.query.ST){

  	var uri = 'https://qa1.myhcl.com/MyHclMobileValidateRest/api/validate/'+req.query.ST+'/'+req.query.DI+'/'+req.query.ET+'/'+req.query.LC;
  	uri = encodeURI(uri);

	request({
	    headers: {
	      'Content-Type': 'application/json'
	    },
	    uri: uri,
      timeout:6000,
	    method: 'GET'
	  },  function (error, response, body){
	  	console.log("Validation result ", body);
      if(!body){
        console.log("Time out for validation".underline.red)
          return res.send({error_id:408, error_message:"Time out for validation checking."});

      }else if(body.substr(2,7) === "DOCTYPE"){
	  		console.log('server error html'.underline.red)
        	return res.send({error_id:500 ,error_message:'Invalid format of validation service. server error!!'});
	  	}

	  	var result = JSON.parse(body);
  	 	if(result.result){
  	 		if(user_id == req.query.LC){
  	 			next();
  	 		}else{
          var validateUrl = 'http://staging2.myhcl.com/MyApprovalsMobile2/Common/ValidateAdmin?username='+req.query.LC
  	 			request({url:validateUrl,
            timeout:6000,
            method:'GET'
          }, function(error, response, body){
  	 				console.log("body--- ", body);
            if(!body){
              console.log("Time out for IsValid checking".underline.red)
              return res.send({error_id:408, error_message:"Time out for validation checking."})
            }else{
              var body = JSON.parse(body);
              if(body.IsValid == 'N'){
                res.send({error_id:403, error_message:"Slow down tiger!! You are not authorized to perform this action."})
              }else if(body.IsValid == 'Y'){
                next();
              }else{
                res.send({error_id:500 ,error_message:"There is some error!! Please try again later."})
              }
            }
  	 			})
  	 		}
  	 	}else{
  	 		console.log("Session Expired")
  	 		res.send({error_id:401, error_message:"Session Expired."})
  	 	}
	})
  }
  //Not to move on production
  else if(req.query.bypass && req.query.secret=='a621nshajdh546sfdg'){
  	next();
  }
  else{
  	console.log("missing something");
  	res.send({error_id:400 ,error_message: "Error!! You are missing something."})
  }
}

//http://staging2.myhcl.com//myhclmobileapi/api/validate/

//https://qa1.myhcl.com/MyHclMobileValidateRest/api/validate/