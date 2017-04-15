app.controller('indexController', ['$scope','countryInfoService', 'navBarService',
function($scope,countryInfoService, navBarService){
  (function initValues(){
    $scope.continentSelected = 'all';
    $scope.metric = 'all';
    $scope.maxResults = 5;
    populateContinentDropDown();
  })();
  function populateContinentDropDown() {
    countryInfoService.getContinentsNames().then(function(data) {
      $scope.continentsNames = data;
    });
  }
  $scope.$watch('continentSelected', function(newVal){
    if (newVal) {
      navBarService.setContinent(newVal);
      navBarService.reload();
    }
  });
  $scope.$watch('metric', function(newVal){
    if (newVal) {
      navBarService.setMetric(newVal);
      navBarService.reload();
    }
  });
  $scope.$watch('maxResults', function(newVal){
    if (newVal) {
      navBarService.setSize(newVal);
      navBarService.reload();
    }
  });
  $scope.selectContinent = function(val) {
    $scope.continentSelected = val;
  }
}]);