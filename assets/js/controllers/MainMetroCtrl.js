'use strict';
baseApp.controller('MainMetroCtrl', ['$scope','$http', '$location', '$routeParams','$timeout', function($scope,$http,$location,$routeParams,$timeout){

  $scope.loading=true;
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

  var createData = function(pArray, nArray) {
  var color = tinycolor("#0186ef");

  var ncolor = tinycolor("#fe0072");
    var data = [];
    var i = 0;
    for (var key in pArray) {
      data.push({
        key: key,
        values: []
      });
      for (var item in pArray[key]) {
        data[i].values.push({word:item,x:Math.random(), y:Math.random(), color: color, size:(pArray[key][item])*400});
      }
      i++;
      $scope.$evalAsync(function(){
        $scope.loading=false;
      })
    }

    for (var key in nArray) {
      data.push({
        key: key,
        values: []
      });
      for (var item in nArray[key]) {
        data[i].values.push({word:item,x:Math.random(), y:Math.random(), color: ncolor, size:(nArray[key][item])*400});
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
    $scope.exampleData = createData($scope.positiveCount,$scope.negativeCount);
  }).error(function(err) {
    console.log(err);
  });

  var tooltipShowing=false;

  $scope.$on('elementMouseover.tooltip.directive',function(event,data){
    $scope.$evalAsync(function(){
      tooltipShowing=true;
      $scope.currentWord = data.point.word;
    });
  });

  $scope.$on('elementMouseout.tooltip.directive',function(event,data){
    tooltipShowing=false;
    $timeout(function(){
      if(tooltipShowing) return;
      $scope.currentWord = '';
    },200);
  });

}]);