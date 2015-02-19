baseApp.controller('MainMetroCtrl', ['$scope','$http', '$location', '$routeParams', function($scope,$http,$location,$routeParams){

  $scope.cityId = $routeParams.id;
  $scope.sentimentScoreArray = '';
  $scope.positiveWords = '';


  $http.get('/metro/'+$scope.cityId+'/getInfo')
  .success(function(data) {
    console.log(data);
  }).error(function(err) {
    console.log(err);
  })



}])