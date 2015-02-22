var baseApp = angular.module('BaseApp',['ui.bootstrap','ngRoute', 'nvd3ChartDirectives']);

baseApp.config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){

    $locationProvider.html5Mode(true);

    //define routes
    $routeProvider
    .when('/',{
        templateUrl:'/views/home.html',
        controller:'HomeCtrl'
    })
    .when('/graph',{
        templateUrl: '/views/graph.html',
        controller: 'GraphCtrl'
    })
    .when('/metro/:id/show',{
      templateUrl:'/views/metro/show.html',
      controller:'MainMetroCtrl'
    })
    .when('/metro/:id/music',{
      templateUrl:'/views/metro/music.html',
      controller:'MetroMusicCtrl'
    })
    .when('/metro/:id/weather',{
      templateUrl:'/views/metro/weather.html',
      controller:'MetroWeatherCtrl'
    })

}]);
