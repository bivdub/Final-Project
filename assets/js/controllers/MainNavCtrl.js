'use strict';
baseApp.controller('MainNavCtrl', ['$scope','$http', '$location','$routeParams',  function($scope,$http,$location,$routeParams){

  $scope.metros = {};
  $scope.metroId = '';

  $scope.isActive = function(url){
    return url == $location.path();
  };

  $http.get('/api/metro').success(function(data){
    $scope.metros = data;
  }).error(function(err){
    console.log(err);
  });

  var pathSplit = $location.path().split('/');

  if(pathSplit.length > 2){
    $http.get('/api/metro/'+pathSplit[2]).success(function(data){
    $scope.asyncSelected = data.name;
    $scope.selectedMetro = data.id;
  }).error(function(err){
    console.log(err);
  });
  }

  $scope.loadLocation = function(){
    $scope.selectedMetro = $scope.asyncSelected.id;
    $location.path('/metro/'+$scope.asyncSelected.id+'/show');
  }

}]);