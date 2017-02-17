'use strict';

var qlikauth = require('./qlik-auth');
var request = require('request');
var ejs = require('ejs');
var fs = require('fs');
var WebSocket = require('ws');
var Converter = require("csvtojson").Converter;



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
        
        request('http://10.2.5.160:4011/nscr/qlikdata/user/'+usrList[counter].ADDomain+'/'+usrList[counter].USERNAME, function (error, response, body) {
          var dynamicTicket=body;
        
          //console.log(dynamicTicket);
          

          
          if (!error && response.statusCode == 200) {

            var bodyObject =JSON.parse(body);
            bhai.push(bodyObject);
          
        counter--;
        if (counter > -1) {

          console.log('requestt initiated');
          setTimeout(fetchDetails, 100);    
       }
       if(counter == 0){
        console.log(bhai);
         res.json(bhai);
       }

      }
      
    });
  }
      
 }
};
module.exports = qlik;