app.controller('restCtrl',function($scope, $state, Services,$http){
    if( localStorage.login=='false'||localStorage.login===undefined){
          console.log("enter in login");
          $state.go('login');
      }  
      console.log(localStorage.haveemail);
      var userEmail =localStorage.haveemail;
      $scope.myForm = {};
     
   $scope.restPassword = function() {  
          $http.post('/resetPass', {
                  password: $scope.myForm.newpassword,
                    userEmail:userEmail     
                })
                .then(function(success){
                  console.log(success.config.data.password);
                $state.go('login');
                    
                },function(error){
                  console.log(error);          
           });
        
    } 
});