app.controller('resultsController', ['$scope','config','navBarService','countryInfoService',
function($scope, config, navBarService, countryInfoService){
  navBarService.enableDisableDropDowns(false); //enable filters

  navBarService.setCallback(function() {
    countryInfoService.getCountries(navBarService.getContinent(), navBarService.getSize()).then(function(data) {
      $scope.countries = data;
      $scope.metric = navBarService.getMetric();
      loadChartData();
    });
  });
  navBarService.reload(); //loads for the first time.
  function loadChartData() {
    $scope.chartA = [];
    $scope.chartB = [];
    if ($scope.metric == 'all') {
      $scope.chartA = formatDataForHighChart('population');
      $scope.chartB = formatDataForHighChart('areaInSqKm');
    }
    else if ($scope.metric == 'population') 
      $scope.chartA = formatDataForHighChart('population');
    else if ($scope.metric == 'areaInSqKm') 
      $scope.chartB = formatDataForHighChart('areaInSqKm');
  }
  function formatDataForHighChart(metric) {
    var result = {
      title: metric,
      data: []
    }
    angular.forEach($scope.countries, function(val) {
      result.data.push({
        name: val.countryName,
        y: parseInt(val[metric])
      });
    });
    
    return result;
  }
}]);