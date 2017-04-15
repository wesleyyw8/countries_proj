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

  function getContinents() { 
    var deferrer = $q.defer();
    getCountryInfo().then(function(data){
      deferrer.resolve(_.groupBy(data.geonames, function(val) {
        return val.continentName;
      }));
    });
    return deferrer.promise;
  }
  getCountries(continentName, metric, maxResults) {

  }

  return service;
}]);