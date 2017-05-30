'use strict';
var request = require('request');
var ejs = require('ejs');
var qendpoint = require('../config/endpoint');




var admin = {


  validateSession: function(req, res, next) {


  1.	LC – Logged In EmployeeCode
2.	DI – Device ID
3.	ET – Expiry TimeSpan
4.	ST – Session Token

  if(!req.query.LC || !req.query.LC || !req.query.LC || !req.query.LC){
  	var LC= req.query.LC;
  }
     
   res.json(req.cookies);
   // request('http://10.98.100.59//myhclmobileapi/api/validate/F78C8A62-4BA1-4775-8149-4D402506CDDA/4E1B2D74-EA75-4C74-9398-F02BBB56CBD9/2017-01-03 10:17:54.687/51456763', function (error, response, body) {
   //        var dynamicTicket=body;
        
   //        if (!error && response.statusCode == 200) {

  }
};
module.exports = admin;