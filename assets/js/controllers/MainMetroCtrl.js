baseApp.controller('MainMetroCtrl', ['$scope','$http', '$location', '$routeParams','$timeout', function($scope,$http,$location,$routeParams,$timeout){

  $scope.cityId = $routeParams.id;
  $scope.sentimentScoreArray = '';
  $scope.positiveWords = '';
  $scope.exampleData = [];
  $scope.currentWord="";

  $scope.mouse = {x: 0, y: 0};

  document.addEventListener('mousemove', function(e){
    $scope.$evalAsync(function(){
      $scope.mouse.x = (e.clientX || e.pageX)+window.scrollX;
      $scope.mouse.y = (e.clientY || e.pageY)+window.scrollY;
    });
  }, false);

  // var myFlower = new CodeFlower("#visualization", 300, 200);



  var createData = function(pArray, nArray) {
    // console.log(pArray);
    // console.log(nArray);
     var colors = tinycolor("#ec0067").analogous();

    colors.map(function(t) { return t.toHexString(); });

    var data = [];
    var i = 0;
    for (var key in pArray) {
      // console.log(key);
      data.push({
        key: key,
        values: []
      });
      for (var item in pArray[key]) {
        // console.log(item);
        // console.log(pArray[key][item])
        // console.log(pArray[key][score])
        data[i].values.push({word:item,x:Math.random(), y:Math.random(), color: colors, size:(pArray[key][item])*200});
      }
      i++;
      console.log(data);
    }

    for (var key in nArray) {
      // console.log(key);
       var colors = tinycolor("#0186ef").analogous();

    colors.map(function(t) { return t.toHexString(); });
      data.push({
        key: key,
        values: []
      });
      for (var item in nArray[key]) {
        // console.log(item);
        // console.log(pArray[key][item])
        // console.log(pArray[key][score])
        data[i].values.push({word:item,x:Math.random(), y:Math.random(), color: colors, size:(nArray[key][item])*200});
      }
      i++;
      console.log(data);
    }
    return data;

  }

  $http.get('/metro/'+$scope.cityId+'/getInfo')
  .success(function(data) {
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
    $scope.exampleData = createData($scope.positiveCount,$scope.negativeCount);

    //elementMouseover.tooltip.directive elementMouseout.tooltip.directive

    // myFlower.update(JSON.stringify($scope.exampleData))

    console.log($scope.exampleData)
  }).error(function(err) {
    console.log(err);
  })


  var tooltipShowing=false;

  $scope.$on('elementMouseover.tooltip.directive',function(event,data){
    // console.log(event,data)
    $scope.$evalAsync(function(){
      tooltipShowing=true;
      $scope.currentWord = data.point.word;
    })

  });
  $scope.$on('elementMouseout.tooltip.directive',function(event,data){
    tooltipShowing=false;
    $timeout(function(){
      if(tooltipShowing) return;
      $scope.currentWord = '';
    },200);
  });

 // [ "#ff0000", "#ff0066", "#ff0033", "#ff0000", "#ff3300", "#ff6600" ]

}])