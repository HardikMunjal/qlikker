app.controller('viewuserCtrl', function ($scope, $http, $stateParams, $state,viewprofile,updateProfile,toastr) {
      console.log($stateParams._id);
      var id = $stateParams._id;
      viewprofile.profile(id).then(function (success) {  
            console.log(JSON.stringify(success.data));
            $scope.details=success.data.rest_info;
          },function(err){
          console.log(err);
      })
});
