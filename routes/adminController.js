'use strict';

var qlikauth = require('./qlik-auth');
var request = require('request');
var ejs = require('ejs');
var fs = require('fs');
//var url = require("url");//edited by shivangi
var qendpoint = require('../config/endpoint');
var nano = require('nano')('http://10.112.177.96:5984');




var admin = {


  getSession: function(req, res, next) {
     //var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    // console.log(req.address());
   //console.log(fullUrl);//edited by shivangi
   //console.log(req.connection.remoteAddress);
   console.log(req.headers);
   console.log(req.cookies);
   //console.log(req);
  /*fs.writeFile('temp.json', req.cookies,  function(err) {
  if (err) {
  return console.error(err);
  }
  console.log("Data written successfully!");
  });*/
   res.json(req.cookies);
  },

  saveHistory: function(req, res, next) {

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
  },

  getHistory: function(req, res, next) {

    var configFile = fs.readFileSync('./user_log.json');
    var config = JSON.parse(configFile);
    res.json(config);
  },

  mashupDynamiser: function(req, res, next) {

    var configFile = fs.readFileSync('./mashup-id.json');
    var config = JSON.parse(configFile);
    res.json(config);
  }
};
module.exports = admin;