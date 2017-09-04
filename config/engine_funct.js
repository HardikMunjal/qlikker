var engine_func = {

  opendoc: function(counter,handle,app_id){
    var odoc= {"method":"OpenDoc","params":[app_id,"","","",false],"handle":handle,"id":counter,"jsonrpc":"2.0"};
    return odoc;
  },

  getobject: function(counter,handle,object_id){
    var gobj= {"method":"GetObject","handle":handle,"params":[object_id],"id":counter,"jsonrpc":"2.0"};
    return gobj;
  },

  gethypercube: function(counter,handle,height,width,top,left){

    var qtop =top || 0;
    var qleft=left || 0;
    var gcube= {"method":"GetHyperCubeData","handle":handle,"params":["/qHyperCubeDef",[{"qTop":qtop,"qLeft":qleft,"qHeight":height,"qWidth":width}]],"id":counter,"jsonrpc":"2.0"};
    return gcube;
  },

  gethypercubepivot:function(counter,handle,height,width,top,left){
    var qtop =top || 0;
    var qleft=left || 0;
    var gpivot= {"method": "GetHyperCubePivotData","handle": handle,"params": ["/qHyperCubeDef",[{"qTop": qtop,"qLeft": qleft,"qHeight": height,"qWidth": width}]],"id": counter,"jsonrpc": "2.0"};
    return gpivot;
  },

  getLayout: function(counter,handle){
    var glayout = {"method":"GetLayout","handle":handle,"params":[],"id":counter};
    return glayout;
  },
  
  clearFilter: function(){
    var clearFilter = {"handle": 1, "method": "ClearAll", "params": { "qLockedAlso": false,"qStateName": ""},"id": 501};
    return clearFilter;
  }
}


module.exports = engine_func;