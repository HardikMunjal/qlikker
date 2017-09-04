
var BaseUrl = "/api/"

app.service('Services', function () {
    this.logID = {};
    this.loginData = {};
    this.chefId = '';
})

app.service('createRestaurantService', function ($http, $q) {

  //****************** Create Restaurant Service ********************

    this.user = function(data) {
            var deff = $q.defer();
            $http({
                    method: "POST",
                    url: BaseUrl+'user/'+localStorage.userName+'/restaurant',
                    data: data,
                    headers: {
                        "Content-Type": "application/json",
                        "authorization":localStorage.token

                        }
                })
                .then(function(objS) {
                    console.log("Data",JSON.stringify(objS.data));
                    deff.resolve(objS);
                }, function(objE) {
                    deff.reject("server Error");
                });
            return deff.promise;
        }
    //******************** Change Password Service ************************

    this.changePass = function (params) {
      console.log("changePass-->>>>"+JSON.stringify(params));
       var deferred = $q.defer(); 
       $http({
                    method: "PATCH",
                    url: BaseUrl+'user/'+localStorage.userName+'/password_change',
                    data: params,
                    headers: {
                        "Content-Type": "application/json",
                        "authorization":localStorage.token
                        }
                })
            .then(function (objS) {
                deferred.resolve(objS);
                console.log("Data in params in fileupload---->>" + (objS));
            }, function (objE) {
                deferred.reject("server error");
            });

        return deferred.promise; 
    }
    
})

//******************** Login Service **************************

  app.service('loginService', function ($http, $q, Services) {
      this.user = function(data) {
              var deff = $q.defer();
              $http({
                      method: "POST",
                      url: BaseUrl+"authenticate",
                      data: data,
                      headers: {
                          "Content-Type": "application/json",
                          }
                  })
                  .then(function(objS) {
                      console.log(objS);
                      deff.resolve(objS);
                  }, function(objE) {
                      deff.reject("server Error");
                  });
              return deff.promise;
          }
  });
 
 //************************* Forgot apssword Service ********************

      app.service('forgotService', function ($http, $q) {
          this.user = function(data) {
                var deff = $q.defer();
                console.log(JSON.stringify(data))
                $http({
                        method: "GET",
                        url: BaseUrl+data+"/forgetPassword",
                        data: data,
                        headers: {
                            "Content-Type": "application/json",
                            }
                    })
                    .then(function(objS) {
                        console.log(objS);
                        deff.resolve(objS);
                    }, function(objE) {
                        deff.reject("server Error");
                    });
                return deff.promise;
            }
      })

// ****************** Restaurant List Service *****************

      app.service('restaurantList',function($q, $http, Services){
             this.user = function(val) {
                var page = val;
                var deff = $q.defer();
                $http({
                        method: "GET",
                        url: BaseUrl+'user/'+page+'/restaurants',
                        //data: data,
                        headers: {
                            "Content-Type": "application/json",
                            "authorization":localStorage.token
                            }
                    })
                    .then(function(objS) {
                        console.log(objS);
                        deff.resolve(objS);
                    }, function(objE) {
                        deff.reject("server Error");
                    });
                return deff.promise;
            }
      })

  //************************ Update Restaurant Service *****************************

      app.service('updateProfile',function($q, $http, Services){
           this.update1=function(data){
          var deff = $q.defer();
              $http.post(BaseUrl+'admin/updateProfile',data)      
               .then(function(success){
                  deff.resolve(success);
              },function(error){
                  console.log(error);
              });
              return deff.promise;                
           }
           this.update=function(data,restId){
            var deff = $q.defer();
                $http({
                            method: "PATCH",
                            url: BaseUrl+'user/'+localStorage.userName+'/'+restId+'/restaurant',
                            data: data,
                            headers: {
                                "Content-Type": "application/json",
                                "authorization":localStorage.token
                                }
                        })    
                 .then(function(success){
                    deff.resolve(success);
                },function(error){
                    console.log(error);
                });
                return deff.promise;                
           }
      })

//************************ Delete Restaurant Service ********************

          app.service('deleteRest',function($q, $http, Services){
               this.list=function(data){
               var deff = $q.defer();
                  $http({
                            method: "DELETE",
                            url: BaseUrl+'/user/'+localStorage.userName+'/restId/restaurant',
                            headers: {
                                "Content-Type": "application/json",
                                 "authorization":localStorage.token
                                     }
                        })  
                   .then(function(success){
                      deff.resolve(success);
                  },function(error){
                      console.log(error);
                  });
                  return deff.promise;        
               }
          })

//********************* Logout Service *********************

        app.service('logoutService',function($state,$window){
             this.logout_admin=function(){
               $window.localStorage.clear();
               $state.go('login');
           }
         })
 
 //******************* httpModifier Factory *******************

       app.factory('httpModifier',function($location){
            return{
                request:function(config){
                    config.headers.servertoken=localStorage.serverToken;
                    return config;
                },
                requestError:function(config){
                    return config;
                },
                response:function(config){
                    return config;
                },
                responseError:function(config){
                    if(config.status==403)
                        $location.path('login')
                        
                        return config;
                }
                
            }
        })
// *********************** View Restaurant Detail ****************************

        app.service('viewprofile',function($q, $http, Services){
            this.profile= function(restId){
                console.log(restId);
                var deff = $q.defer();
                $http({
                          method: "GET",
                          url: BaseUrl+'user/'+localStorage.userName+'/'+restId+'/restaurant',
                          
                          headers: {
                              "Content-Type": "application/json",
                              // "restId": restId,
                              "authorization":localStorage.token
                              }
                      })
                .then(function(objS){
                    deff.resolve(objS);
                    console.log(objS);
                },function(error){
                    console.log(error);
                });
                return deff.promise;
            }
        })
  
  