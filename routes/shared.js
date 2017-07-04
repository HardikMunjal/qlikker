'use strict';

var qlikauth = require('./qlik-auth');
var request = require('request');
var ejs = require('ejs');
var fs = require('fs');
var qendpoint = require('../config/endpoint');
var userModel = require('./model/userInfo')




var qlik = {


  checkRole: function(req, res, next) {

    if(req.query.sap_id && req.query.client_id === 'resource'){

    userModel.getSingleUserDetails(function(err, result) {

    if (err) {
      return next(err);
    }
    
    res.json(result);

  });

    }
    else{
      res.send('Either your token has been expired or you have not provided the valid credential');
      return;
    }

    next();
    }
};
module.exports = qlik;