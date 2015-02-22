baseApp.controller('MetroMusicCtrl', ['$scope','$http','$routeParams', function($scope,$http,$routeParams){

  $scope.cityId = $routeParams.id;


  $http.get('/metro/'+$scope.cityId+'/getMusicInfo')
    .success(function(data) {
      $scope.data = data;
      // $scope.dbInfo = data[0];
      // $scope.locationInfo = data[1];
      // $scope.scoreArray = data[3].scores;
      // $scope.positiveArray = data[3].positiveArray;
      // $scope.negativeArray = data[3].negativeArray;
      // $scope.positiveCount = data[3].positiveCount;
      // $scope.negativeCount = data[3].negativeCount;
      // $scope.metroTracks = data[4];
      // $scope.metroWeather = data[5];
      // $scope.exampleData = createData($scope.positiveCount,$scope.negativeCount);
      console.log($scope.exampleData)
    }).error(function(err) {
      console.log(err);
    })

}])

// var myFlower = new CodeFlower("#visualization", 300, 200);
  // myFlower.update(JSON.stringify($scope.exampleData))
