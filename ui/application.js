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
app.controller('mainController', ['$scope','navBarService',
function($scope, navBarService){
  navBarService.enableDisableDropDowns(true);
}]);
app.controller('resultsController', ['$scope','config','navBarService','countryInfoService',
function($scope, config, navBarService, countryInfoService){
  navBarService.enableDisableDropDowns(false); //enable filters

  navBarService.setCallback(function() {
    countryInfoService.getCountries(navBarService.getContinent(), navBarService.getSize()).then(function(data) {
      console.log(data);
      $scope.countries = data;
      $scope.metric = navBarService.getMetric();
    });
  });
  navBarService.reload(); //loads for the first time.
}]);
app.directive('tableResults', function () {
  return {
    replace: true,
    scope: {
      data: '=',
      metric: '='
    },
    templateUrl: 'directives/table-results/template.html',
    link: function ($scope, element, attrs) { 
      
    } 
  }
});
app.service('countryInfoService', ['$q', '$http','config', function($q, $http,config){
  var data;
  var service = {
    getCountryInfo : getCountryInfo,
    getContinentsNames: getContinentsNames,
    getCountries: getCountries
  }
  function getCountryInfo() {
    if (!data) {
      return $http.get(config.baseUrl + config.getCountryInfo).then(function(response){
        data = getCountriesMap(response.data.geonames);
        return data;
      });
    }
    else {
      var deferrer = $q.defer();
      deferrer.resolve(data);
      return deferrer.promise;
    }
  }
  //I just need those 4 objs
  function getCountriesMap(data) {
    return _.map(data, function(val){
      return {
        "areaInSqKm": val.areaInSqKm,
        "countryName": val.countryName,
        "continentName": val.continentName,
        "population": val.population
      }
    });
  }
  function getContinentsNames () {
    var deferrer = $q.defer();
    getCountryInfo().then(function(data){
      deferrer.resolve(Object.keys(_.groupBy(data, function(val) {
        return val.continentName;
      })));
    });
    return deferrer.promise;
  }

  function getCountries(continentName, size) { 
    var deferrer = $q.defer();
    getCountryInfo().then(function(data){
      var countries = getCountriesByContinent(data, continentName);
      deferrer.resolve(countries.slice(0,size));
    });
    return deferrer.promise;
  }

  function getCountriesByContinent(data, continent) {
    if (continent == 'all') 
      return data;
    return _.filter(data, function(val) {
      if (val.continentName == continent)
        return true;
    });
  }

  return service;
}]);
app.service('navBarService', ['config', function(config){
  var navBar = {
    enableDisableDropDowns: enableDisableDropDowns,
    getContinent: getContinent,
    setContinent: setContinent,
    getSize: getSize,
    setSize: setSize,
    getMetric: getMetric,
    setMetric: setMetric,
    reload: reload,
    setCallback: setCallback
  }, continent, size, metric, callback;

  function enableDisableDropDowns(disable) {
    angular.element('.dropdown-toggle').prop('disabled', disable);
  }
  function getContinent() {
    return this.continent;
  }
  function setContinent(continent) {
    this.continent = continent;
  }
  function getSize() {
    return this.size;
  }
  function setSize(size) {
    this.size = size;
  }
  function getMetric() {
    return this.metric;
  }
  function setMetric(metric) {
    this.metric = metric;
  }
  function setCallback(callback){
    this.callback = callback;
  }
  function reload(){
    if (this.callback)
      this.callback();
  }
  return navBar;
}]);