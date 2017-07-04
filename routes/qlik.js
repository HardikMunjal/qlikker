'use strict';

var qlikauth = require('./qlik-auth');
var request = require('request');
var ejs = require('ejs');
var fs = require('fs');
var qendpoint = require('../config/endpoint');
var admin = require('./controller/adminController')





var qlik = {


  proxyRedirectFromQlik: function(req, res, next) {

    if(global.user_id && global.user_directory){
      var profile = {
       'UserDirectory': global.user_directory,
       'UserId' : global.user_id
      }
    qlikauth.requestTicket(req, res, profile);
    }
    else{
      res.send('Either your token has been expired or you have not provided the valid credential');
      return;
    }
  },

  userExistingSession: function(req, res, next) {

    
    if(!req.params.user_id && !req.params.user_directory){
     res.send('User must have to pass directory and user_id', 400);
     return;
    }

    if(!req.query.client_id){
      res.send('User must have to pass client_id', 400);
      return;
    }

    if(req.query.client_id != 'merlin'  && req.query.client_id != 'delivery'){
      res.send('Invalid client_id', 412);
      return;
    }

    if(!req.query.scope || req.query.scope != 'session'){
      res.send('User must have to pass valid scope', 400);
      return;
    }

    var profile = {
      UserDirectory: req.params.user_directory
    }

    profile.UserId = req.params.user_id;
    console.log('session checking');
    qlikauth.getUserSession(req, res, profile);
  
    },

  getUsersList: function(req, res, next) {

    
    var profile = {
      UserDirectory: 'ASSOCIATES'
    }

    profile.UserId = 'QLIKDEVELOPER5';
    console.log('users fetching');
    qlikauth.getUsersDetails(req, res, profile);
  
    },

  userQlikTicket: function(req, res, next) {

    var destination = qendpoint.qlik_proxy_pt+"hub/";
    

    if(!req.params.user_id && !req.params.user_directory){
     res.send('User must have to pass directory and user_id', 400);
     return;
    }

    if(!req.query.client_id){
      res.send('User must have to pass client_id', 400);
      return;
    }

    if(req.query.client_id != 'merlin' && req.query.client_id != 'delivery' && req.query.client_id != 'hcllive'){
    
      res.send('Invalid client_id', 412);
      return;
    }

    if(!req.query.scope || req.query.scope != 'ticket'){
      res.send('User must have to pass valid scope', 400);
      return;
    }


    if(req.query.open){
      destination = req.query.open;
     if(!req.query.app_name){
        if(destination.indexOf(qendpoint.qlik_proxy_pt) == -1){
          res.send("Invalid URL in open parameter",400);
          return;
        }
      }
      if(destination == qendpoint.qlik_proxy_pt+"hub/"){
        res.send("To open hub, You need to exclude / from the end",400);
        return;
      }
      
      // var x= JSON.stringify(req.cookies);
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
    }

    if(req.query.app_name=='resource'){
      destination='http://10.2.5.158/node/sense/app/f083256e-3ea6-4a4b-97fa-ed72e5700554'
    }
    
    global.user_id = req.params.user_id.trim();
    global.user_directory = req.params.user_directory.trim(); 
    
    if(global.user_id.toUpperCase()=='QLIKPOLESTAR'){

      if(!req.query.client_secret){
        res.send("Client secret is required to access admin access",400);
        return;
      }
      if(req.query.client_secret != 'pF860GhtRedUjkRte1'){
        res.send("Wrong Cient secret",400);
        return;
      }
    }

    if(global.user_id.toUpperCase()=='QLIKADMIN'){

      if(!req.query.client_secret){
        res.send("Client secret is required to access admin access",400);
        return;
      }
      if(req.query.client_secret != 'rF860GhFYdUjkRTyf'){
        res.send("Wrong Cient secret",400);
        return;
      }
    }
    getTicket(destination);
    
    function getTicket(url){
      
      var dynamicTicket={};
      request(url, function (error, response, body) {
        dynamicTicket=body;
        if (!error && response.statusCode == 200) {
          var bodyObject =JSON.parse(body);
          if(bodyObject.UserId.toUpperCase().trim() != req.params.user_id.toUpperCase().trim()){
           console.log('######################### coming at danger end ############################')
           console.log(bodyObject);

           console.log(req.params.user_id);
           global.user_id = req.params.user_id.trim();
           global.user_directory = req.params.user_directory.trim();
           if(req.query.open){
            destination = req.query.open;
              if(req.query.app_name=='resource'){
                destination='http://10.2.5.158/node/sense/app/f083256e-3ea6-4a4b-97fa-ed72e5700554'
              }

           }else{
             destination= qendpoint.qlik_proxy_pt+"hub/"
           }
            
           getTicket(destination);
          } else {
          console.log('Ticket Rqst successfully cmpltd for '+bodyObject.UserId); 


// ****************  RESOURCE ROLE VERIFICATION  *********************************
          if(bodyObject.TargetUri != qendpoint.qlik_proxy_pt+"hub/"){
            if(req.query.app_name =='resource' && req.query.open){
              return  res.json('Invalid open parameter for resource')

//************** Role Verfication from QLIKHUB.EJS**********************88
              
              // dynamicTicket = JSON.parse(dynamicTicket);
              // dynamicTicket.roleflag = true;
              // dynamicTicket =JSON.stringify(dynamicTicket)
              // dynamicTicket.roleflag = true;


//****************** Role Verfication from qliksense **************************************

              // admin.roleverifier(dynamicTicket,function(err,result){
              //   if(err){
              //     return res.json('Invalid Handle');
              //   }
              //   else{

              //     //Fetch APP URL FROM CONFIG FILE
              //     console.log('coming',result);
              //     //return res.redirect('/scr/ticket/user/associates/qlikdeveloper5?client_id=merlin&scope=ticket&open=http://10.2.5.158/node/sense/app/f083256e-3ea6-4a4b-97fa-ed72e5700554/sheet/a0072aff-1354-4855-939d-97c8151ddd85/state/analysis');
              //      return res.redirect(result);
              //   }
              // })
            }
            else{
            console.log('not coming here')
            res.render('qlikhub.ejs',{data:dynamicTicket});
            return;
          }
            
          }
          if(req.query.user == 'hardi'){

                var profile = {
                 UserDirectory: 'ss'
                }

                profile.UserId = 'ss';
                profile.Ticket= bodyObject.Ticket;
                console.log('users fetching');
                qlikauth.getUsersDetails(req, res, profile);
                return;
              }
             if(!req.query.app_name){
              res.json(bodyObject);
              global.user_id = 'null';
              global.user_directory = 'null';
              return;
            }
          }
          }
          
       })

    }
        
  }
};
module.exports = qlik;