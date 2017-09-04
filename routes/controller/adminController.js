
var qlikauth = require('../qlik-auth');
var request = require('request');
var ejs = require('ejs');
var fs = require('fs');
var qendpoint = require('../../config/endpoint');
var WebSocket = require('ws');
var Logger = require('../model/userModel');
var dashboardFinder = require('../../config/dashboard_finder');
var colors = require('colors');
var Converter = require("csvtojson").Converter;
var nodemailer = require('nodemailer');


var admin = {


  getSession: function(req, res, next) {
  
    var updator = req.cookies;
   if(!updator['X-Qlik-Session-Node']){
    console.log('injection applied');
    updator['X-Qlik-Session-Node'] = updator['X-Qlik-Session'];
   }
   res.json(updator);

  },

  userAccessView: function(req, res, next){

    //DO VALIDATION STUFF
    res.render('userAccess.html');

  },

  getUser: function(req, res, next){
    
    var bulkdata =[];
    console.log('start scheduling job');
    var counter = 40;
    var usrList= [];
    var csvFileName="./UserList.csv";
    var csvConverter= new Converter({});

    //end_parsed will be emitted once parsing finished
    csvConverter.on("end_parsed",function(jsonObj){
        console.log(jsonObj); //here is your result json object
        usrList = jsonObj;
        fetchDetails();
        if(counter == 0){
         res.json(bulkdata);
       }
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
            bulkdata.push(userBody);
          
            counter--;
            if (counter > -1) {

              console.log('requestt initiated');
              setTimeout(fetchDetails, 100);    
           }
           if(counter == -1){
             res.json(bulkdata);
           }

          }
      
    });
  }
      

    
  },



  roleverifier: function(ticket,cb){
    
    //console.log('roleverifier',ticket);
    
    var ticket= JSON.parse(ticket);
    //console.log(ticket.Ticket)
    var ws = new WebSocket('ws://10.2.5.158/node/app/f083256e-3ea6-4a4b-97fa-ed72e5700554?reloadUri=http://10.2.5.158/node/dev-hub/engine-api-explorer&QlikTicket='+ticket.Ticket
    );
    var opendocIntegrated = {"method":"OpenDoc","params":['f083256e-3ea6-4a4b-97fa-ed72e5700554',"","","",false],"handle":-1,"id":1,"jsonrpc":"2.0"}
    var getobject= {
      "handle": 1,
      "method": "GetObject",
      "params": {
        "qId": "kKpRS"
      },
      "id":2
    }
     
    var getlayout= {
            "method": "GetLayout",
            "handle": 2,
            "params": [],
            "outKey": -1,
            "jsonrpc": "2.0",
            "id": 3
          }
              
    ws.on('open', function open() {
       ws.send(JSON.stringify(opendocIntegrated));
    });

    //**************************** INCOMING MESSAGE EVENT *****************************
    ws.on('message', function(data , flags) {
      
     
     
      var s = JSON.parse(data);
            
      
      if(s.id==1){
        
            ws.send(JSON.stringify(getobject));
          }


        if(s.id==2){
            ws.send(JSON.stringify(getlayout));
          }
         if(s.id==3){
            var role =s.result.qLayout.qHyperCube.qGrandTotalRow[0].qText;
            console.log(role);
            if (role =='Executive'){
              cb(null,'/scr/ticket/user/associates/qlikdeveloper5?client_id=merlin&scope=ticket&open=http://10.2.5.158/node/sense/app/f083256e-3ea6-4a4b-97fa-ed72e5700554/sheet/a0072aff-1354-4855-939d-97c8151ddd85/state/analysis')
             
            } 
            else{
              //window.open('http://10.2.5.158/node/sense/app/f083256e-3ea6-4a4b-97fa-ed72e5700554/sheet/bMPTA/state/analysis',"_self");
              cb(null,'/scr/ticket/user/associates/qlikdeveloper5?client_id=merlin&scope=ticket&open=http://10.2.5.158/node/sense/app/f083256e-3ea6-4a4b-97fa-ed72e5700554/sheet/bMPTA/state/analysis')
              
            }
          }
    });
      


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
  },

  saveLogger: function(req, res, next){

    if(!req.params['0'] || !req.params.user_id || !req.query.client_id || !req.query.scope){
      console.log("Log not saved.".bgRed.bold)
      next();
    }else{
      var log_json = {
        user_id:req.params['0'],
        user_directory:req.params.user_id.toLowerCase(),
        client_id:req.query.client_id,
        scope:req.query.scope,
        service_name:req.query.service_name
      }
      if(req.query.open){
        var open_var = req.query.open;
        open_var = open_var.split('?')[0];

        if(dashboardFinder.hasOwnProperty(open_var)){
          log_json.dashboard_name = dashboardFinder[open_var][0];
          log_json.application = dashboardFinder[open_var][1];
        }else{
          log_json.dashboard_name = open_var;
          log_json.application = open_var;
        }
      }else{
        log_json.dashboard_name = req.query.scope;
        log_json.application = req.query.scope;
      }
      if(req.headers.origin){
        log_json.local_ip = req.headers.origin.substring('::ffff:'.length);
      }else if(req.connection.remoteAddress){
        log_json.server_ip = req.connection.remoteAddress.substring('::ffff:'.length);
      }

      var logger = new Logger(log_json);
      logger.save(function(err, logData){
        if(err){
          console.log("Error in saving logs-- ".underline.red, err);
          next();
        }else{
          console.log("log saved.".inverse);
          next();
        }
      })
    }
  },

  getLogCount : function(req, res){
    if(!req.params.filter || (req.params.filter == "today")){
    var date = new Date(new Date().setHours(0,0,0,0));
    }else if(req.params.filter == "week"){
      var date = getDate(new Date(), null);
    }else if(req.params.filter == "month"){
      var date = getDate(new Date(), "month");
    }
    console.log("date--- ", date);

    Logger.aggregate([
        { "$group": {
            "_id":  {client: "$client_id" },
            "TotalUserCount": { "$sum": {
                        '$cond': [
                            { '$gte': ['$createdAt', new Date(date)]}, 
                            1,
                            0
                        ]
                    } },
            "uniqueUserIds" : {"$addToSet" : {
                        '$cond': [
                            { '$gte': ['$createdAt', new Date(date)]}, 
                            "$user_id",
                            null
                        ]
                    } }
          }
        }/*,
        { "$project" : {"_id.client" : 1, "TotalUserCount" : 1, uniqueUserIds : {$size : "$userids"} }
        }*/
      ], function(err, result){
          if(err){
            return res.json({code:500, message: "Internal server error."})
          }else{

            var uniqueUserIds = new Array();
            for (var i = 0; i < result.length; i++) {
              for(var j = 0; j< result[i].uniqueUserIds.length; j++){
                if (result[i].uniqueUserIds[j] !== null) {
                  uniqueUserIds.push(result[i].uniqueUserIds[j]);
                }
              }
              result[i].uniqueUserCount = uniqueUserIds.length;
              delete result[i].uniqueUserIds;
              uniqueUserIds = [];
            }
            return res.json({code:200, data:result})
          }
    })
  },

  topTwentyLogs: function(req, res){
    Logger.find().sort({createdAt:-1}).limit(20).exec(function(err, result){
      if(err){
        return res.json({code:500, message: "Internal server error."})
      }else{
        return res.json({code:200, data:result})
      }
    })
  },

  userApplicationCount: function(req,res){
    if(!req.params.client_id){
      return res.json({code:400, message: "Client_id is missing."})
    }else if((!req.query.from_date && !req.query.to_date) || (!req.query.from_date && req.query.to_date)){
      var from_date = new Date(new Date().setHours(0,0,0,0)).toUTCString();
      var to_date = new Date().toUTCString();
      var message = "Showing data for today.";
    }else if(req.query.from_date && !req.query.to_date){
      console.log("from--- ", typeof req.query.from_date);
      var from_date = new Date(parseInt(req.query.from_date)).toUTCString();
      var to_date = new Date().toUTCString();
      var message = "Showing data from "+new Date(parseInt(req.query.from_date))+ " till today.";
    }else{
      var from_date = new Date(parseInt(req.query.from_date)).toUTCString()
      var to_date = new Date(parseInt(req.query.to_date)).toUTCString();
      var message = "Showing data from "+new Date(parseInt(req.query.from_date))+ " till " +new Date(parseInt(req.query.to_date));
    }
    console.log("to-- ", from_date, to_date);
    
    Logger.aggregate([
      {
        $match:{client_id:req.params.client_id, createdAt :{$gte:new Date(from_date), $lte: new Date(to_date)}}
      },
        {
          $group: { 
              _id :  { 
                user_id: "$user_id",
                application: "$application"
              },
              total: { $sum : 1 } 
           }
        }/*,
        { $group : { 
              _id : 
              {
                      user_id: "$_id.user_id", 
                      application:"$_id.scope",
                      total:"$total"
                  }
           }
         }*/
      ], function(err,result){
        if(err){
          return res.json({code:500, message: "Internal server error."})
        }else{
          return res.json({code:200, data:result, message:message})
        }
      })
  },
  mailshoot: function(req, res){
    var smtpTransport =   nodemailer.createTransport({
        host: "CL.COM", // hostname
        secureConnection: false, // TLS requires secureConnection to be false
        port: 25, // port for secure SMTP
        tls: {
           ciphers:'SSLv3'
        },
        auth: {
            user: 'hclqlikservice@hcl.com',
            pass: 'Comnet@123'
        }
    });

// setup e-mail data, even with unicode symbols
    var mailOptions = {
        from: 'hclqlikservice@hcl.com', // sender address (who sends)
        to: 'abhishek-a@hcl.com', // list of receivers (who receives)
        subject: 'Hello ', // Subject line
        text: 'Hello world ', // plaintext body
        html: '<b>Hello world </b><br> This is the first email sent with Nodemailer in Node.js' // html body
    };

    // send mail with defined transport object
    smtpTransport.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log("error in nodemailer--- ",error);
        }

        console.log('Message sent: ' + info.response);
    });
  }

};

/*function getDate(date, type) {

  var now = date? new Date(date) : new Date();

  // set time to some convenient value
  now.setHours(0,0,0,0);
  if(type == "month"){
    now.setDate(01);
  }
  var monday = new Date(now);
  monday.setDate(monday.getDate() - monday.getDay() + 1);

  return monday;
}*/

function getDate(date, type) {
  var now = date? new Date(date) : new Date();
  if(type === "month"){
      return new Date(now.getFullYear(), now.getMonth(), 1);
    }
  now.setHours(0,0,0,0)
  var day = now.getDay(),
      diff = now.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
  return new Date(now.setDate(diff));

  return monday;
}
module.exports = admin;