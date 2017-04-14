app.controller('indexController', ['$scope','countryInfoService',
function($scope,countryInfoService){
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
}]);