app.directive('tableResults', function () {
  return {
    replace: true,
    scope: {
      data: '='
    },
    templateUrl: 'directives/table-results/template.html',
    link: function ($scope, element, attrs) { 
    } 
  }
});