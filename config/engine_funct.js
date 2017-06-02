var engine_func = {

  opendoc: function(counter,handle,app_id){
    var odoc= {"method":"OpenDoc","params":[app_id,"","","",false],"handle":handle,"id":counter,"jsonrpc":"2.0"};
    return odoc;
  },

  getObject: function(counter,handle,object_id){
    var gobj= {"method":"GetObject","handle":handle,"params":[object_id],"id":counter,"jsonrpc":"2.0"};
    return gobj;
  },

  getHypercube: function(counter,handle,object_id){
    var gcube= {"method":"OpenDoc","params":[app_id,"","","",false],"handle":handle,"id":counter,"jsonrpc":"2.0"};
    return gcube;
  },

  getHypercubePivot:function(counter,handle,object_id){
    var gpivot= {"method":"OpenDoc","params":[app_id,"","","",false],"handle":handle,"id":counter,"jsonrpc":"2.0"};
    return gpivot;
  }
}


module.exports = engine_func;