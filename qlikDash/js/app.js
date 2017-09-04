var app = angular.module('MyApp', ['ionic','toastr'])
app.config(function ($stateProvider, $urlRouterProvider,$sceProvider,$httpProvider) {

    $sceProvider.enabled(false);
    $httpProvider.interceptors.push('httpModifier');
    $stateProvider
    
    //******************** Login ***********************

        .state('login', {
            url: '/login',
            controller: 'loginCtrl',
            templateUrl: 'templates/login.html'
        })

    //******************** Side Menu *********************

        .state('menu', {
                url: '/menu',
                resolve: {
                authorize: 
                  function($location,$q,$timeout) {
                    var deff=$q.defer();
                    if(localStorage.token!=undefined){
                      return deff.resolve("user Authorised");
                    }
                      else{
                        $timeout(function(){
                          $location.path("/login");
                        },10)
                        
                      }
                      return deff.promise;
                  }
              },
                controller: 'menuCtrl',
                templateUrl: 'templates/menu.html'
            })

    //****************** Change Password **********************

            .state('menu.changePass', {
                url: '/changePass',
               resolve: {
                    authorize: 
                      function($location,$q,$timeout) {
                        var deff=$q.defer();
                        if(localStorage.token!=undefined){
                          return deff.resolve("user Authorised");
                        }
                          else{
                            $timeout(function(){
                              $location.path("/login");
                            },10)
                            
                          }
                          return deff.promise;
                      }
                  },
                controller: 'changePassCtrl',
                templateUrl: 'templates/changePass.html',
            })

    //******************* Update Password ************************

             .state('updatepass', {
                  url: '/updatepass',
                  controller: 'updatePasswordCtrl',
                  templateUrl: 'templates/updatePassword.html',
              })

    //***************** Forgot Password **************************

            .state('forgotpassword', {
                url: '/forgotpassword',
                controller: 'forgetCtrl',
                templateUrl: 'templates/forgotpassword.html',
            })

    //****************** Forgot Password OTP **********************

             .state('forgotpasswordOtp', {
                url: '/forgotpasswordOtp',
                controller: 'forgetpasswordOtpCtrl',
                templateUrl: 'templates/forgotpasswordOtp.html',
            })
    //******************** Restaurant List ************************

              .state('menu.adminHome', {
                      url: '/adminHome/:offset',
                    resolve: {
                      authorize: 
                        function($location,$q,$timeout) {
                          var deff=$q.defer();
                          if(localStorage.token!=undefined){
                            return deff.resolve("user Authorised");
                          }
                            else{
                              $timeout(function(){
                                $location.path("/login");
                              },10)
                              
                            }
                            return deff.promise;
                        }
                    },
                      controller: 'restaurantListCtrl',
                      templateUrl: 'templates/restaurantList.html',
                  
                  })
      //******************* Update Restaurant ***************************
        
               .state('menu.editRest', {
                      url: '/editRest/:_id',
                      controller: 'editrestCtrl',
                    resolve: {
                      authorize: 
                        function($location,$q,$timeout) {
                          var deff=$q.defer();
                          if(localStorage.token!=undefined){
                            return deff.resolve("user Authorised");
                          }
                            else{
                              $timeout(function(){
                                $location.path("/login");
                              },10)
                              
                            }
                            return deff.promise;
                        }
                    },
                      templateUrl: 'templates/edit_rest.html',
                      params: {
                          userDetails: null
                      }
                  })

      //********************* View Restaurant ********************************
                  .state('menu.viewRest', {
                      url: '/viewRest/:_id',
                      controller: 'viewuserCtrl',
                    resolve: {
                      authorize: 
                        function($location,$q,$timeout) {
                          var deff=$q.defer();
                          if(localStorage.token!=undefined){
                            return deff.resolve("user Authorised");
                          }
                            else{
                              $timeout(function(){
                                $location.path("/login");
                              },10)
                              
                            }
                            return deff.promise;
                        }
                    },
                      templateUrl: 'templates/view_rest.html',
                      params: {
                          userDetails: null
                      }
                  })

    //********************* Add New Restaurant *************************

        .state('menu.addNewRest', {
                url: '/addNewRest',
                controller: 'addNewRestCtrl',
          resolve: {
            authorize: 
              function($location,$q,$timeout) {
                var deff=$q.defer();
                if(localStorage.token!=undefined){
                  return deff.resolve("user Authorised");
                }
                  else{
                    $timeout(function(){
                      $location.path("/login");
                    },10)
                    
                  }
                  return deff.promise;
              }
          },
                templateUrl: 'templates/addNewRest.html'
            });

     
    $urlRouterProvider.otherwise('/login');

});
app.run(function($rootScope,$location,$window,$state) {
  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
    var aa=localStorage.login;
      if(aa == 'false' || localStorage.login == null || localStorage.login == undefined){  
          console.log("enter");    
          $state.go('login', {}, {notify:false});
      }
      else if(toState.name == 'menu.changePass' || toState.name == 'menu.updatepass' || toState.name == 'menu.adminHome'
           || toState.name == 'menu.editRest' || toState.name == 'menu.viewRest' || toState.name == 'menu.addNewUser' 
           || toState.name == 'menu.addNewRest'|| toState.name == 'menu.viewUser' || toState.name == 'menu.editUser'
           || toState.name == 'menu.forgotpassword'|| toState.name == 'menu.changePass'){
          console.log("enter in else if");
      }
  });
});

//***************** Image Uploader ********************

      // app.directives("fileUploader",function(){
      //   return{
      //     restrict:"A",
      //     scope:{
      //       objFile:"="
      //     },
      //     link:function(scope,elem,attr){
      //       elem.bind("change",function(ev){
      //         scope.objFile=ev.target.file[0]?ev.target.file[0]:undefined;
      //         scope.apply();
      //       })
      //     }
      //   }
      // })

      /*
      <input type="file" file-uploader obj-file="<controllerScope>"/>



      controller
        $http({
                  method: 'POST',
                  url: '/upload-file',
                  headers: {
                      'Content-Type': 'multipart/form-data'
                  },
                  data: {
                      email: Utils.getUserInfo().email,
                      token: Utils.getUserInfo().token,
                      upload: $scope.file
                  },
                  transformRequest: function (data, headersGetter) {
                      var formData = new FormData();
                      angular.forEach(data, function (value, key) {
                          formData.append(key, value);
                      });

                      var headers = headersGetter();
                      delete headers['Content-Type'];

                      return formData;
                  }
              })
              .success(function (data) {

              })
              .error(function (data, status) {

              });
      */


