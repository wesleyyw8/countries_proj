app.controller('resultsController', ['$scope','config','navBarService','countryInfoService',
function($scope, config, navBarService, countryInfoService){
  navBarService.enableDisableDropDowns(false);
  countryInfoService.getContnents().then(function(data) {
    console.log(data);
  });
}]);