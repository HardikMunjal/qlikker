'use strict';

var qlikauth = require('./qlik-auth');
var request = require('request');
var ejs = require('ejs');
var fs = require('fs');
var WebSocket = require('ws');
var Converter = require("csvtojson").Converter;
var qendpoint = require('../config/endpoint');



var qlik = {


  extractBI: function(req, res, next) {


    var bhai =[];
    console.log('start scheduling job');
    var users = ['qlikdeveloper4','qlikdeveloper5','apoorvjain','nareshn','ayazk'];
    var userdir = ['associates','associates','associates','hcltech','geo'];
    var counter = 40;
    var usrList= [];

    //var counter = 4;


    //CSV File Path or CSV String or Readable Stream Object
    var csvFileName="./UserList.csv";

    //new converter instance
    var csvConverter=new Converter({});

    //end_parsed will be emitted once parsing finished
    csvConverter.on("end_parsed",function(jsonObj){
        console.log(jsonObj); //here is your result json object
        usrList = jsonObj;
        fetchDetails();

        //var counter = 70;
        //console.log(counter);
        if(counter == 0){
         res.json(bhai);
       }

       //res.end('bhai');

    });

    //read from file
    fs.createReadStream(csvFileName).pipe(csvConverter);



     function fetchDetails(){
        
        request(qendpoint.qlik_pt+'nscr/qlikoptdata/user/'+usrList[counter].ADDomain+'/'+usrList[counter].USERNAME, function (error, response, body) {
          var dynamicTicket=body;
        
          if (!error && response.statusCode == 200) {

            var bodyObject =JSON.parse(body);

            var userBody = {};
            userBody.user_id = usrList[counter].USERNAME;
            userBody.user_directory = usrList[counter].ADDomain;
            userBody.qlikData = bodyObject;
            bhai.push(userBody);
          
            counter--;
            if (counter > -1) {

              console.log('requestt initiated');
              setTimeout(fetchDetails, 100);    
           }
           if(counter == -1){
            console.log(bhai);
             res.json(bhai);
           }

          }
      
    });
  }
      
 }
};
module.exports = qlik;