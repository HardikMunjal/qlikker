app.controller('menuCtrl', function($scope, $http, $stateParams, $state, logoutService) {
	$scope.fullName= localStorage.fullName;
	$scope.image=localStorage.image;
	$scope.showProfile=function(){

		$state.go('menu.showProfile')
	}
	$scope.logout=function(){
	    localStorage.clear();
		$state.go('login')
	}
});