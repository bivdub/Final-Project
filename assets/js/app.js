var baseApp = angular.module('BaseApp',['ui.bootstrap','ngRoute']);

baseApp.config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){

    $locationProvider.html5Mode(true);

    //define routes
    $routeProvider
    .when('/',{
        templateUrl:'/views/home.html',
        controller:'HomeCtrl'
    })
    .when('/metro/:id/show',{
      templateUrl:'/views/metro/show.html',
      controller:'MainMetroCtrl'
    })


}]);
