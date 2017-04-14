var app = angular.module('wesCountriesApp',['ngRoute']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider,$locationProvider){
  $routeProvider.
    when('/main', {
      templateUrl: '../views/main.html',
      controller: 'mainController'
    }).
    when('/results', {
      templateUrl: '../views/results.html',
      controller: 'resultsController'
    }).
    otherwise({
      redirectTo: '/main'
    });
}]);

app.factory('config', [function() {
  var baseUrl = "endpoints/";
  return {
    baseUrl: baseUrl,
    getCountryInfo: 'getCountryInfo'
  }
}]);
app.controller('indexController', ['$scope',
function($scope){
  (function initValues(){
    $scope.continentSelected = 'all';
    $scope.metric = 'all';
    $scope.maxResults = 5;
    
  })();
}]);
app.controller('mainController', ['$scope','navBarService',
function($scope, navBarService){
  navBarService.enableDisableDropDowns(true);
}]);
app.controller('resultsController', ['$scope','config','navBarService',
function($scope, config, navBarService){
  navBarService.enableDisableDropDowns(false);
}]);
app.service('navBarService', ['config', function(config){
  var navBar = {
    enableDisableDropDowns: enableDisableDropDowns
  };
  function enableDisableDropDowns(disable) {
    angular.element('.dropdown-toggle').prop('disabled', disable);
  }
  return navBar;
}]);