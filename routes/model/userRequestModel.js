'use strict';

var qlikauth = require('../qlik-auth');
var request = require('request');
var ejs = require('ejs');
var fs = require('fs');
var qendpoint = require('../../config/endpoint');
var nano = require('nano')('http://10.112.177.96:5984');




var admin = {


  saveRequestDetail: function(req, res, next) {


    var user_id = req.params.user_id;
    var user_directory = req.params.user_directory;
    var client = req.query.client_id;
    var scope;
    var user_ids = ['u1', 'u2', 'u3', 'u4','u5'];
    var users = nano.use('qlikuser');
    user_ids.forEach(function(element) {
     var date = new Date();
     var d=date.getDate();
     var m=date.getMonth()+1;
     var y=date.getFullYear();
     var h=date.getHours(); 
     var mi=date.getMinutes(); 
     var s=date.getSeconds();
     var dateTime=d+'/'+m+'/'+y+' '+h+':'+mi+':'+s;
        console.log(element);
        users.insert({ name: element,user_directory: 'hcltech', date_n_time: dateTime, path: 'ticket', client:'merlin', scope: 'pipline data' }, element, function(err) {  
       if (err && err.statusCode != 412) {
         console.error(err);
       }
       else {
         console.log('document exists');
       }
       });
    });
  }
};
module.exports = admin;