
baseApp.controller('GraphCtrl', ['$scope','$http', '$location', '$routeParams', function($scope,$http,$location,$routeParams){

  $scope.cityId = $routeParams.id;
  $scope.sentimentScoreArray = '';
  $scope.positiveWords = '';



  $http.get('/metro/'+$scope.cityId+'/getInfo')
  .success(function(data) {

    //for debugging (can be deleted)
    console.log(data);
    $scope.data = data;
    $scope.dbInfo = data[0];
    $scope.locationInfo = data[1];
    $scope.scoreArray = data[3].scores;
    $scope.positiveArray = data[3].positiveArray;
    $scope.negativeArray = data[3].negativeArray;
    $scope.positiveCount = data[3].positiveCount;
    $scope.negativeCount = data[3].negativeCount;


    var buildItem = function(color,size){
        var x = Math.random();
        var y = Math.random();
        return {"color":color,"x":x,"y":y,"size":size};
    }


    //init empty data array
    var dataValues=[];

    var positiveColor = function(r,g,b){
         r = 230;
         g = 37;
         b = Math.floor(Math.random()*50);
        return "rgb("+r+","+g+","+b+")";
}
    //foreach positiveArray
   $scope.positiveArray.forEach(function(word){
        var size = data[3].positiveCount[word];
        var color = positiveColor();
        dataValues.push(buildItem(color,size));
   })

     var negativeColor = function(r,g,b){
         r =  Math.floor(Math.random()*100);
         g = 105;
         b =222;
        return "rgb("+r+","+g+","+b+")";
}
    //foreach positiveArray
   $scope.negativeArray.forEach(function(word){
        var size = data[3].positiveCount[word];
        var color = negativeColor();
        dataValues.push(buildItem(color,size));
   })



    //set dataarray to $scope

    // var dataValues=[];

    $scope.exampleData = [
        {
            "key":"Group 0",
            "values":dataValues
        }
    ];
console.log($scope.exampleData);

  }).error(function(err) {
    console.log(err);
  })


    $scope.chartLoaded = function(chart){
        console.log('chart loaded')
        // chart.showXAxis(false);
        // chart.showYAxis(false);
    }

    $scope.showGraph = function(id){
       return $scope.sentiments[id];
    }

}]);