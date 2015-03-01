'use strict';
baseApp.controller('MetroMusicCtrl', ['$scope','$http','$routeParams','$route', function($scope,$http,$routeParams,$route){

  $scope.loading=true;
  $scope.cityId = $routeParams.id;

  function drawFlower() {

    var width;
    var height;
    var visObj = document.getElementById('visualization');

    width = visObj.clientWidth;
    if(width > 900){
      height = parseInt(width*(2/3));
    }else{
      height = parseInt(width*(3/2));
    }

    var myFlower = new CodeFlower("#visualization", Math.floor(width)/1.5, Math.floor(height)/1.25);
    myFlower.update($scope.data);

  }

  var resizing=0;

  $http.get('/metro/'+$scope.cityId+'/getMusicInfo')
  .success(function(data) {
    $scope.data = data;
    drawFlower();

    $scope.$evalAsync(function(){
      $scope.loading=false;
    });

    window.addEventListener('resize',function(){
      resizing += 1;
      setTimeout(function(){
        resizing -= 1;
        if(resizing > 0) return;

        $route.reload();
      },200);

    });

  }).error(function(err) {
    console.log(err);
  });

}]);