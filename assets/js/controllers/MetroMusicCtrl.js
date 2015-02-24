baseApp.controller('MetroMusicCtrl', ['$scope','$http','$routeParams','$route', function($scope,$http,$routeParams,$route){

  $scope.cityId = $routeParams.id;
  // var myFlower = new CodeFlower("#visualization", 1000, 1000);


  function drawFlower() {
    var width;
    var height;
    var visObj = document.getElementById('visualization')

    width = visObj.clientWidth;
    if(width > 900){
      height = parseInt(width*(3/4));
    }else{
      height = parseInt(width*(4/3));
    }
    var myFlower = new CodeFlower("#visualization", width, height);
    myFlower.update($scope.data);

  }

  var resizing=0;

  $http.get('/metro/'+$scope.cityId+'/getMusicInfo')
  .success(function(data) {
    $scope.data = data;
    drawFlower();

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
  })

}])

  // myFlower.update(JSON.stringify($scope.exampleData))
