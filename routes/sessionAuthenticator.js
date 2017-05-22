'use strict';
var request = require('request');
var ejs = require('ejs');
var qendpoint = require('../config/endpoint');




var admin = {


  validateSession: function(req, res, next) {
     
   res.json(req.cookies);
  }
};
module.exports = admin;