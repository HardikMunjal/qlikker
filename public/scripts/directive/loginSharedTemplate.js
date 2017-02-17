loginApp.directive('loginTemplate',function(){
  return {
    restrict: 'E',
    templateUrl: function(tElement,tAttrs){
        return tAttrs.templateUrl ? tAttrs.templateUrl : 'pages/shared/loginSharedTemplate.html'; 
    }
  };
});