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