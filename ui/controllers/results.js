app.controller('resultsController', ['$scope','config','navBarService','countryInfoService',
function($scope, config, navBarService, countryInfoService){
  navBarService.enableDisableDropDowns(false);
  countryInfoService.getCountries('all').then(function(data) {//navBarService.getContinent(), navBarService.getSize(), navBarService.getMetric()
    console.log(data);
  });
}]);