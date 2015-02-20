baseApp.controller('MainMetroCtrl', ['$scope','$http', '$location', '$routeParams', function($scope,$http,$location,$routeParams){

  $scope.cityId = $routeParams.id;
  $scope.sentimentScoreArray = '';
  $scope.positiveWords = '';



  $http.get('/metro/'+$scope.cityId+'/getInfo')
  .success(function(data) {
    var createData = function(pArray, nArray) {
      // console.log(pArray);
      // console.log(nArray);
      var data = [];
      var i = 0;
      for (var key in pArray) {
        data.push({
          'key': key,
          'values': []
        });
        // console.log(key);
        for (var item in pArray[key]) {
          // console.log(item);
          // console.log(pArray[key][item])
          // console.log(pArray[key][score])
          data[0].values.push({x:Math.random(), y:Math.random(), color:'rgb(255,0,0)', size:undefined});
        }
        i++;
        // console.log(data);
      }
      $scope.exampleData = data;

    }
    // console.log(data);
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
    console.log($scope.exampleData)

    createData($scope.positiveCount,$scope.negativeCount);
    console.log($scope.exampleData)




  }).error(function(err) {
    console.log(err);
  })



}])