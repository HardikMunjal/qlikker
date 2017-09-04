app.controller('restaurantListCtrl', function($scope, $http, $stateParams, $state, restaurantList, loginService, Services,toastr) {
    console.log("enter"+localStorage.login)

    //********************* Pagination *******************

    $scope.currentPage = 1;
    $scope.nextPageDetail = function(){
      console.log('page number -> '+$scope.currentPage);
        restaurantList.user($scope.currentPage).then(function(success) {
          $scope.noOfPages = success.data.rest_info.pages;
          $scope.pageNo = success.data.rest_info.page;
          $scope.restDetails=success.data.rest_info.docs;
        },function(err){
             console.log((err));
        });
    }
     $scope.nextPageDetail();
     $scope.nextClk = function(){
        $scope.currentPage++;
        $scope.nextPageDetail();
     }
     $scope.preClk = function(){
        $scope.currentPage--;
        $scope.nextPageDetail();
     }
 

 //******************** Delete Restaurant ****************************

    $scope.deleteRest = function(userId) {
        var _userId=userId;
        BootstrapDialog.show({  title: '', message: 'Do you want to delete this restaurant ?',
            buttons: [{ label: 'NO',action: function(dialogItself) {
                    dialogItself.close();
                }
            }, {
                label: 'Yes',
                action: function(dialogItself) {
                    $http({
                  method: "DELETE",
                  url: BaseUrl+'user/'+localStorage.userName+'/'+_userId+'/delRestaurant',
                  //data: data,
                  headers: {
                      "Content-Type": "application/json",
                      "authorization":localStorage.token
                      }
              }).then(function(success) {
                               console.log(success);
                               toastr.success("Deleted Successfully");  
                               restaurantList.user().then(function(success) {
                            $scope.restDetails=[];
                            

                          for(i=0;i<success.data.rest_info.docs.length;i++) {
                            $scope.restDetails.push(success.data.rest_info.docs[i])
                            localStorage.restId=$scope.restDetails[i]._id;
                            console.log(JSON.stringify($scope.restDetails[i]._id));
                        }
                    })
                        }, function(error) {
                            console.log(error);
                        })
                    dialogItself.close();
                }
            }]
        });
  }

});
