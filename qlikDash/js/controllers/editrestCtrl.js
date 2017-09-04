app.controller('editrestCtrl', function($scope, $http, $stateParams, $state,viewprofile,updateProfile,toastr) {

     console.log($stateParams._id);
     var id = $stateParams._id;
     $scope.prices=[1,2,3,4]

   //******************* View Restaurant Detail ************************

    viewprofile.profile(id).then(function (success) {  
         console.log(JSON.stringify(success.data));
         $scope.myForm={};
          $scope.myForm.restName=success.data.rest_info.restaurant_name;
          $scope.myForm.menu=success.data.rest_info.menu;
          $scope.myForm.price=success.data.rest_info.price_level;
          $scope.myForm.country=success.data.rest_info.address.country;
          $scope.myForm.state=success.data.rest_info.address.state;
          $scope.myForm.city=success.data.rest_info.address.city;
          $scope.myForm.zip=parseInt(success.data.rest_info.address.zip);
          $scope.myForm.address=success.data.rest_info.address.formatedAddress;
          $scope.myForm.lattitude=success.data.rest_info.address.latitude;
          $scope.myForm.longitude=success.data.rest_info.address.longitude;
    },function(err){
      console.log(err);
    })

    //****************** Update Restaurant Detail ********************

   $scope.save=function(){
        $scope.myForm.address.state=$scope.myForm.state;
        console.log("state save--->");
        var data = {
               "restaurant_name": $scope.myForm.restName,
               "menu": $scope.myForm.menu,
               "country": $scope.myForm.country,
               "state": $scope.myForm.state,
               "city": $scope.myForm.city,
               "zip": $scope.myForm.zip,
               "formatedAddress": $scope.myForm.address,
                "environment":"",
                "price_level": $scope.myForm.price,
                "tags":[],
                "latitude": $scope.myForm.lattitude,
                "longitude": $scope.myForm.longitude
              
          }
          updateProfile.update(data,$stateParams._id).then(function (success) {
                if(success.data.code==200){
                  $state.go('menu.adminHome');
                   toastr.success('Updated Successfully.');
                 
                }
                else{

                     toastr.error("All Fields Are Not Filled");
                }
              },function(err){
               console.log(err);
               toastr.error('Connection error');
          })
   }
});