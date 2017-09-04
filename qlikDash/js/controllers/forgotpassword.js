app.controller('forgetCtrl',function($scope, $state, forgotService,toastr){

     $scope.myForm = {};

     //************** Forgot Password *************************

      $scope.forgotPassword = function () {
            console.log("form data--->"+($scope.myForm));
            localStorage.userEmail=$scope.myForm.email;
            forgotService.user($scope.myForm.email).then(function (ObjS) {
             console.log("success data--->"+(ObjS));
              if(ObjS.data.code == 200){
                $state.go('forgotpasswordOtp');
                toastr.success(ObjS.data.message);
              }else{
             toastr.error(ObjS.data.message);
              }  
            }, function (ObjE) {
             toastr.error(ObjS.data.response_message);
                console.log("Error : " + (ObjE));
       
            })

      }

    
})

//********************* Forgot Password OTP Ctrl ***************************

.controller('forgetpasswordOtpCtrl',function($scope,$http,$state,toastr){
        $scope.myForm={};
        $scope.forgotPassword = function () {
            $http({
                  method: "PATCH",
                  url: BaseUrl+'/'+localStorage.userEmail+'/verifyOTP',
                  data: {"otp":$scope.myForm.otp},
                  headers: {
                      "Content-Type": "application/json",
                      }
              })
            .then(function(objS){
              console.log(JSON.stringify(objS))
              if(objS.data.code==200){
              $state.go("updatepass");
              toastr.success("Otp Verified Successfully");  
            }
            else{
             toastr.error("Otp Not Verified");  
            }
            },function(objE){
              console.log(objE);
            });
        }
})

//********************* Update Password Ctrl ***************************

.controller('updatePasswordCtrl',function($scope,$http,$state){
  $scope.myForm={};
        $scope.updatePassword = function () {
            $http({
                  method: "PATCH",
                  url: BaseUrl+'/'+localStorage.userEmail+'/updatePass',
                  data: {"new_pass":$scope.myForm.password,
                          "new_pass_confirm":$scope.myForm.cpwd
                        },
                  headers: {
                      "Content-Type": "application/json",
                      }
              })
            .then(function(objS){
              console.log(JSON.stringify(objS))
               if(objS.data.code==200){
                  $state.go("login");
                }
                else{
                  alert(objS.data.message)
                }
              
            },function(objE){
              console.log(objE);
            });
        }
});