baseApp.controller('MainMetroCtrl', ['$scope','$http', '$location', '$routeParams', function($scope,$http,$location,$routeParams){

  $scope.cityId = $routeParams.id;
  $scope.sentimentScoreArray = '';
  $scope.positiveWords = '';
  $scope.exampleData = [];


  var createData = function(pArray, nArray) {
    var data = [];
    var i = 0;
    for (var key in pArray) {
      data.push({
        key: key,
        values: []
      });
      for (var item in pArray[key]) {
        data[i].values.push({x:Math.random(), y:Math.random(), color:'rgb(255,0,0)', size:(pArray[key][item])*200});
      }
      i++;
    }

    for (var key in nArray) {
      data.push({
        key: key,
        values: []
      });
      for (var item in nArray[key]) {
        data[i].values.push({x:Math.random(), y:Math.random(), color:'rgb(0,0,255)', size:(nArray[key][item])*200});
      }
      i++;
    }
    return data;

  }

  $http.get('/metro/'+$scope.cityId+'/getBasicInfo')
  .success(function(data) {
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
    $scope.exampleData = createData($scope.positiveCount,$scope.negativeCount);
    console.log($scope.exampleData)
  }).error(function(err) {
    console.log(err);
  })
}])