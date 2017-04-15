app.controller('resultsController', ['$scope','config','navBarService','countryInfoService',
function($scope, config, navBarService, countryInfoService){
  navBarService.enableDisableDropDowns(false); //enable filters

  navBarService.setCallback(function() {
    countryInfoService.getCountries(navBarService.getContinent(), navBarService.getSize()).then(function(data) {
      console.log(data);
      $scope.countries = data;
    });
  });
  navBarService.reload(); //loads for the first time.
}]);