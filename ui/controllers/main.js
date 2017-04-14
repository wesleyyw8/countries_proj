app.controller('mainController', ['$scope','navBarService',
function($scope, navBarService){
  navBarService.enableDisableDropDowns(true);
}]);