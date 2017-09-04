 app.controller('loginCtrl', function ($scope, $ionicPopup, $state,loginService,$window,Services,toastr) {
    console.log("enter in loginCtrl assest1")
    $scope.myForm = {};  

    //**************** Login ***************************** 
        $scope.login = function () { 
               var myForm = $scope.myForm;
               myForm.type = "ADMIN";   
               console.log("admin data-->"+( myForm.type));
               console.log("encryped pwd");
               console.log(myForm);
                  var data={
                          "username":$scope.myForm.email, 
                          "password":$scope.myForm.password
                          }
                  console.log(JSON.stringify(data.username))  
                  loginService.user(data).then(function (ObjS) {
                      console.log("hh--->",ObjS.data.message)
                       if(ObjS.data==null){
                          toastr.error('Server error.');
                       }
                        else if (ObjS.data.code == 200) {
                           localStorage.login='true';
                           localStorage.userName=ObjS.data.username;
                           localStorage.token=ObjS.data.token.substr(4,ObjS.data.token.length-1);
                           console.log(JSON.stringify(localStorage.token))
                           $state.go("menu.adminHome");  
                           toastr.success('Login successful.');    
                      }
                      else{
                          toastr.error(ObjS.data.message);
                      }
                  }, function (ObjE) {          
                       console.log("Error : " + JSON.stringify(ObjE)); 
                         toastr.error('Connection error.');          
                  });
        };

    $scope.forgotpas = function () {
        $state.go("forgotpassword");
    }
    $(function () {
        $('input').iCheck({
          checkboxClass: 'icheckbox_square-blue',
          radioClass: 'iradio_square-blue',
          increaseArea: '20%' // optional
        });
      });

});


