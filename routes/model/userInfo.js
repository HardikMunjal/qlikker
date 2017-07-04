var mysql = require('../../config/mysql');

var userInfo = {

 getSingleUserDetails: function(options, cb) {
 
      var query = {
            sql: 'show tables'
            }
            console.log(query.sql);
            //console.log(query.values);
     mysql.simpletrans(query, function(e, r) {
        if (e) {
            console.log(e);
            //cb(e);
        } else {
            console.log(r[0])
            cb(null,r);
        }
    });

 }

};
module.exports = userInfo;


   


