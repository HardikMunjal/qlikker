'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var logschema = new Schema({
	client_id:{
		type:String
	},
	scope:{
		type:String
	},
	user_id:{
		type:String
	},
	user_directory:{
		type:String
	},
	dashboard_name:{
		type:String,
		default:null
	},
	application:{
		type:String,
		default:null
	},
	service_name:{
		type:String,
		default:null
	},
	local_ip:{
		type:String,
		default:null
	},
	server_ip:{
		type:String,
		default:null
	},
	createdAt:{
		type:Date,
		default:Date.now
	}
});

var logger = mongoose.model('Logger', logschema);

module.exports = logger;