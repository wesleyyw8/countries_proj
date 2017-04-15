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
      var others = calculateTotal(countries, size);
      countries = countries.slice(0,size);
      countries.push(others);
      deferrer.resolve(countries);
    });
    return deferrer.promise;
  }
  function calculateTotal(countries, size) {
    var total = {
      countryName: 'Other',
      continentName: 'Other',
      areaInSqKm: 0,
      population: 0
    }
    angular.forEach(countries.slice(size), function(val){
      total.areaInSqKm += parseInt(val.areaInSqKm);
      total.population += parseInt(val.population);
    })
    return total;
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