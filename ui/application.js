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
app.controller('mainController', ['$scope','navBarService',
function($scope, navBarService){
  navBarService.enableDisableDropDowns(true);
}]);
app.controller('resultsController', ['$scope','config','navBarService','countryInfoService',
function($scope, config, navBarService, countryInfoService){
  navBarService.enableDisableDropDowns(false);
  countryInfoService.getContnents().then(function(data) {
    console.log(data);
  });
}]);
app.service('countryInfoService', ['$q', '$http','config', function($q, $http,config){
  var data;
  var service = {
    getCountryInfo : getCountryInfo,
    getContinentsNames: getContinentsNames,
    getContnents: getContnents
  }
  function getCountryInfo() {
    if (!data) {
      return $http.get(config.baseUrl + config.getCountryInfo).then(function(response){
        data = response.data;
        return response.data;
      });
    }
    else {
      var deferrer = $q.defer();
      deferrer.resolve(data);
      return deferrer.promise;
    }
  }
  function getContinentsNames () {
    var deferrer = $q.defer();
    getCountryInfo().then(function(data){
      deferrer.resolve(Object.keys(_.groupBy(data.geonames, function(val) {
        return val.continentName;
      })));
    });
    return deferrer.promise;
  }

  function getContnents () {
    var deferrer = $q.defer();
    getCountryInfo().then(function(data){
      deferrer.resolve(_.groupBy(data.geonames, function(val) {
        return val.continentName;
      }));
    });
    return deferrer.promise;
  }

  return service;
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