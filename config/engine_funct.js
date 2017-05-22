var engine_func = {

  opendoc: function(counter,handle,app_id){

    return {"method":"OpenDoc","params":[app_id,"","","",false],"handle":handle,"id":counter,"jsonrpc":"2.0"}
  },

  getObject: function(counter,handle,object_id){

    return {"method":"GetObject","handle":handle,"params":[object_id],"id":counter,"jsonrpc":"2.0"}
  },

  getHypercube: function(object){

    return {"method":"OpenDoc","params":[app_id,"","","",false],"handle":handle,"id":counter,"jsonrpc":"2.0"}
  },

  getHypercubePivot:function(object){

    return {"method":"OpenDoc","params":[app_id,"","","",false],"handle":handle,"id":counter,"jsonrpc":"2.0"}
  }
}


module.exports = engine_func;