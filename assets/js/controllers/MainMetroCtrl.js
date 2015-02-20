baseApp.controller('MainMetroCtrl', ['$scope','$http', '$location', '$routeParams', function($scope,$http,$location,$routeParams){

  $scope.cityId = $routeParams.id;
  $scope.sentimentScoreArray = '';
  $scope.positiveWords = '';


  $http.get('/metro/'+$scope.cityId+'/getInfo')
  .success(function(data) {
    console.log(data);
    $scope.data = data;
    $scope.dbInfo = data[0];
    $scope.locationInfo = data[1];
    $scope.scoreArray = data[3].scores;
    $scope.positiveArray = data[3].positiveArray;
    $scope.negativeArray = data[3].negativeArray;
    $scope.positiveCount = data[3].positiveCount;
    $scope.negativeCount = data[3].negativeCount;
    $scope.metroTracks = data[4];
    $scope.metroWeather = data[5];
  }).error(function(err) {
    console.log(err);
  })



}])