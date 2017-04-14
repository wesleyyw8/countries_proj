app.controller('indexController', ['$scope',
function($scope){
  (function initValues(){
    $scope.continentSelected = 'all';
    $scope.metric = 'all';
    $scope.maxResults = 5;
    
  })();
}]);