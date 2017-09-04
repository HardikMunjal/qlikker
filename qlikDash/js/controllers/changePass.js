app.controller('changePassCtrl',function($scope,$state, Services,$http,logoutService,createRestaurantService,toastr){
    $scope.myForm={};
    
    //**************Change Password **************
    
    $scope.changePass=function(){
      console.log("change-->>"+($scope.myForm));
        var data = {
          old_pass:$scope.myForm.oldpassword,  
          new_pass:$scope.myForm.password,   
          new_pass_confirm:$scope.myForm.cpwd
        }
        console.log(data);  
        createRestaurantService.changePass(data).then(function(success){     
              if(success.data.code==200){
                console.log(success.data.message);
                $state.go('menu.adminHome');
                toastr.success(success.data.message);  
              }else{
              console.log(success.data.message);
               toastr.error(success.data.message);  
              }
            console.log((success));
          },function(err){
           console.log("err----->"+err)
             toastr.error('Connection error.');  
      });   
    }
});