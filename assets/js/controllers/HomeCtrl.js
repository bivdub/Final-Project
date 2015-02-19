baseApp.controller('HomeCtrl', ['$scope','$http', '$location',  function($scope,$http,$location){

  $scope.metros = {};
  $scope.metroId = '';

  $scope.getLocation = function(val) {
    return $http.get('/api/metro'
    ).then(function(response){
      // console.log(response);
      // console.log(response.data);
      // $scope.metroId = response.data.id
      return response.data.map(function(item){
        return {item: item.name, id: item.id}
      });
    });
  };

  $http.get('/api/metro').success(function(data){
    // console.log(data);
    $scope.metros = data;
  }).error(function(err){
    // console.log(err);
  });

  $scope.redirect = function(){

  }


}]);