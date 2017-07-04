var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var request = require('request');
var ipsec = require('./routes/ip_securer')
var mysql = require('mysql');
var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/QlikDatabase');

var con = mysql.createConnection({
  host: '10.98.10.13',
    user: 'Insightsappuser',
    password : 'India@123',
    //port : 3306, //port mysql
    database:'Insights'
});

con.connect(function(err) {
  if (err) {
  	console.log(err)
  }
  else{
  	console.log("Connected!")
  };
});


var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', function(socket){
  console.log('a user connected');
});

app.use('/', ipsec.CrossOriginHeaders);

   
app.use(bodyParser.urlencoded());
app.use(bodyParser.json({ 
 	limit: '10mb' 
    })); 

app.use(cookieParser());


app.use(router);
require('./routes')(router);


app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/public/views');
app.engine('html', require('ejs').renderFile)
//app.set('view engine', 'html');


var server = http.listen(4011, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

//http://10.68.128.126
