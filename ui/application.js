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
app.directive('pieChart', function () {
  return {
    replace: true,
    restrict: 'E',
    scope: {
      data: '='
    },
    templateUrl: 'directives/pie-chart/template.html',
    link: function (scope, element, attrs) { 
      element[0].id = scope.$id+'-chart';
      
      function renderChart() {
        Highcharts.chart(element[0].id, {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: ''
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.y}</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.y}',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    }
                }
            },
            series: [{
                name: '',
                colorByPoint: true,
                data: scope.data.data
                // data: [{
                //     name: 'Microsoft Internet Explorer',
                //     y: 56.33
                // }, {
                //     name: 'Firefox',
                //     y: 10.38
                // }, {
                //     name: 'Safari',
                //     y: 4.77
                // }, {
                //     name: 'Opera',
                //     y: 0.91
                // }, {
                //     name: 'Proprietary or Undetectable',
                //     y: 0.2
                // }]
            }]
        });
      }

      renderChart();
      scope.$watch(function(){
        return scope.data;
      }, function(newVal) {
        if (newVal) {
          angular.element(element).find('.highcharts-container').remove();
          renderChart();
        }
      })
    } 
  }
});
app.directive('tableResults', function () {
  return {
    replace: true,
    restrict: 'E',
    scope: {
      data: '=',
      metric: '='
    },
    templateUrl: 'directives/table-results/template.html',
    link: function (scope, element, attrs) { 
      
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