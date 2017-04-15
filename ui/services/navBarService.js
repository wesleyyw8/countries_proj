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