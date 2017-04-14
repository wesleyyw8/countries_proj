app.service('navBarService', ['config', function(config){
  var navBar = {
    enableDisableDropDowns: enableDisableDropDowns
  };
  function enableDisableDropDowns(disable) {
    angular.element('.dropdown-toggle').prop('disabled', disable);
  }
  return navBar;
}]);