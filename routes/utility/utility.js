'use strict';

var WebSocket = require('ws');
var qendpoint = require('../../config/endpoint');
var qobject_id = require('../../config/merlin_object');



var utilfunc = {


  openSocket: function(data, application_id, cb) {

    if(data.target=='TICKET'){

           ws = new WebSocket(
            qendpoint.qlik_ws+'app/314889d1-1873-423f-8f6c-57b854f599fb?reloadUri='+qendpoint.qlik_proxy_pt+'dev-hub/engine-api-explorer&QlikTicket='+data.token
            );

        }
    else if(data.target=='SESSION'){

       ws = new WebSocket(
        qendpoint.qlik_ws+'app/314889d1-1873-423f-8f6c-57b854f599fb?reloadUri='+qendpoint.qlik_proxy_pt+'dev-hub/engine-api-explorer',
        [],
        {
          'headers': {
            'Cookie': 'X-Qlik-Session-Node='+data.token
          }
        }
        );
      }

  }

};
module.exports = utilfunc;