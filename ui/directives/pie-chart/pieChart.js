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