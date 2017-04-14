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