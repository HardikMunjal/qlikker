app.controller('addNewRestCtrl', function ($scope, $state,$http,Services,createRestaurantService,toastr) {
      
      $scope.myForm = {};  

      //***************** Autocomplete Address ***********************

      $scope.myForm = {'address': '', 'lattitude': '', 'longitude' : ''};
      var inputFrom = document.getElementById('from');
      var autocompleteFrom = new google.maps.places.Autocomplete(inputFrom);
      google.maps.event.addListener(autocompleteFrom, 'place_changed', function() {
              var place = autocompleteFrom.getPlace();
              $scope.myForm.lattitude = place.geometry.location.lat();
              $scope.myForm.longitude = place.geometry.location.lng();
              $scope.myForm.address = place.formatted_address;
             
              console.log(place.address_components.length);

              for(i=0;i<place.address_components.length;i++)
              {
                if(place.address_components[i].types[0]=="country")
                {
                  $scope.myForm.country =  place.address_components[i].long_name;
                }
                if(place.address_components[i].types[0]=="administrative_area_level_1")
                {
                  $scope.myForm.state =  place.address_components[i].long_name;
                }
                if(place.address_components[i].types[0]=="administrative_area_level_2")
                {
                  $scope.myForm.city =  place.address_components[i].long_name;
                }
              }
              $scope.$apply("myForm");
      });

    $scope.myForm.address.loc = [];
    $http.get('js/controllers/countryList.json').success(function(data) {
      $scope.allcountry = data;
    });
   
    $scope.selectCountry = function(){
       console.log("country--->>>"+$scope.myForm.country);
      var country = JSON.parse($scope.myForm.country)
      console.log(country.code);
      $scope.myForm.address.country = country.name;
    }
    
  console.log(localStorage.getItem('token'))

//************ Add new Restaurant ****************

    $scope.save=function(){
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
     console.log(data);
     createRestaurantService.user(data).then(function(success) {
     	console.log(success)
      if(success.data.code == 201){      
        $state.go('menu.adminHome');
        toastr.success("Restaurant Created Successfully"); 
      }else{
       toastr.error("All required fields are not filled");
      }    
     },function(err){
        console.log(err);
         toastr.error('Connection error.');
     });
    }
     
});
