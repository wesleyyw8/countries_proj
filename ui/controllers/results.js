app.controller('resultsController', ['$scope','config','navBarService','countryInfoService',
function($scope, config, navBarService, countryInfoService){
  navBarService.enableDisableDropDowns(false);

  navBarService.setCallback(function() {
    countryInfoService.getCountries(navBarService.getContinent(), navBarService.getSize()).then(function(data) {
      console.log(data);
    });
  });
  navBarService.reload();

}]);