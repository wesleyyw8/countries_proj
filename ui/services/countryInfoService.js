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

  function getCountries(continentName, metric, size) { 
    var deferrer = $q.defer();
    getCountryInfo().then(function(data){
      deferrer.resolve(getCountriesByContinent(data.geonames, continentName));
    });
    return deferrer.promise;
  }

  function getCountriesByContinent(data, continent) {
    if (continent == 'all') 
      return data;
    _.filter(data, function(val) {
      if (val.continentName == continent)
        return true;
    });
  }

  return service;
}]);