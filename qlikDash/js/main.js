var app = angular.module('myApp', []);

/* Progress bar controller */
app.controller('progressCtrl', function($scope, $http) {
  $http.get("http://10.2.5.158:4011/getLogCount/today").then(function (response) {
      $scope.myData = response.data.data;
  });
});

/* Top 20 hits controller */
app.controller('topHits', function($scope, $http,$interval) {
/*  $scope.top20Hits = function(){*/
    $http.get("http://10.2.5.158:4011/topTwentyLogs").then(function (response) {
      $scope.topHitsData = response.data.data;
    });
 /* }*/
  /*$interval(function () {
      $scope.top20Hits();
  }, 1000);*/

});

/* Merlin hits controller */
app.controller('merHits', function($scope, $http) {
  $http.get("http://10.2.5.158:4011/userApplicationCount/merlin").then(function (response) {
      $scope.merData = response.data.data;
  });
});

/* Symphony hits controller */
app.controller('symHits', function($scope, $http) {
  $http.get("http://10.2.5.158:4011/userApplicationCount/delivery").then(function (response) {
      $scope.symData = response.data.data;
  });
});


/* HCL Live hits controller */
app.controller('hclliveHits', function($scope, $http) {
  $http.get("http://10.2.5.158:4011/userApplicationCount/hcllive").then(function (response) {
      $scope.hclliveData = response.data.data;
  });
});


