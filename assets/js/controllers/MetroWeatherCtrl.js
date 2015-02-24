baseApp.controller('MetroWeatherCtrl', ['$scope', '$http', '$routeParams','$route', function($scope,$http,$routeParams,$route){

  $scope.loading=true;

  $scope.cityId = $routeParams.id
  var fill = d3.scale.category20();

  function drawWordCloud(){

    var width,height;


    var draw = function(words) {

      d3.select("#vis").append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate("+Math.floor(width/2)+","+Math.floor(height/2)+")")
      .selectAll("text")
      .data(words)
      .enter().append("text")
      .style("font-size", function(d) { return d.size + "px"; })
      .style("font-family", "Raleway")
      .style("fill", function(d, i) { return fill(i); })
      .attr("text-anchor", "middle")
      .attr("transform", function(d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .text(function(d) { return d.text; });

      $scope.$evalAsync(function(){
        $scope.loading=false;
      })

    }

    var visObj = document.getElementById('vis')


    //determine width / height
    width = visObj.clientWidth;
    if(width > 900){
      height = parseInt(width*(3/4));
    }else{
      height = parseInt(width*(4/3));
    }



    d3.scale.log().range([10, 100]);
    d3.layout.cloud().size([width, height])
    .timeInterval(10)
    .words($scope.words)
    .padding(1)
    .rotate(function(d) { return ~~(Math.random() * 5) * 30 - 60; })
    .font("Raleway")
    .fontSize(function(d) { return d.size; })
    .on("end", draw)
    .start();

  }

  var resizing=0;


  $http.get('/metro/'+$scope.cityId+'/getWeatherInfo')
  .success(function(data) {
    $scope.data = data;
    $scope.weatherData = data;
    $scope.words = $scope.weatherData.map(function(d) {
      return {text: d, size: 10 + Math.random() * 70};
    });
    drawWordCloud();

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