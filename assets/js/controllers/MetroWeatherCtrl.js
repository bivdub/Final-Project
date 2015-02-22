baseApp.controller('MetroWeatherCtrl', ['$scope', '$http', '$routeParams', function($scope,$http,$routeParams){

  $scope.cityId = $routeParams.id
  var fill = d3.scale.category20();

  function draw(words) {
    d3.select("#vis").append("svg")
      .append("g")
        .attr("transform", "translate(800,900)")
      .selectAll("text")
        .data(words)
      .enter().append("text")
        .style("font-size", function(d) { return d.size + "px"; })
        .style("font-family", "Impact")
        .style("fill", function(d, i) { return fill(i); })
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; });
  }

  var fontSize = d3.scale.log().range([10, 100]);

  // var layout = cloud()
  //     .size([960, 600])
  //     .timeInterval(10)
  //     .text(function(d) { return d.key; })
  //     .font("Impact")
  //     .fontSize(function(d) { return fontSize(+d.value); })
  //     .rotate(function(d) { return ~~(Math.random() * 5) * 30 - 60; })
  //     .padding(1)
  //     .on("word", progress)
  //     .on("end", draw)
  //     .words([…])
  //     .start();

  $http.get('/metro/'+$scope.cityId+'/getWeatherInfo')
  .success(function(data) {
    $scope.data = data;
    $scope.weatherData = data;
    console.log($scope.weatherData);
    d3.layout.cloud().size([1500, 800])
        .timeInterval(10)
        .words($scope.weatherData.map(function(d) {
          return {text: d, size: 10 + Math.random() * 70};
        }))
        .padding(1)
        .rotate(function(d) { return ~~(Math.random() * 5) * 30 - 60; })
        .font("Impact")
        .fontSize(function(d) { return d.size; })
        .on("end", draw)
        .start();
    // d3.layout.cloud()
    //   .size([960, 600])
    //   .timeInterval(10)
    //   .text(function(d) { return d.key; })
    //   .font("Impact")
    //   .fontSize(function(d) { return fontSize(+d.value); })
    //   .rotate(function(d) { return ~~(Math.random() * 5) * 30 - 60; })
    //   .padding(1)
    //   .on("word", progress)
    //   .on("end", draw)
    //   .words($scope.weatherData)
    //   .start();
    // $scope.dbInfo = data[0];
    // $scope.locationInfo = data[1];
    // $scope.scoreArray = data[3].scores;
    // $scope.positiveArray = data[3].positiveArray;
    // $scope.negativeArray = data[3].negativeArray;
    // $scope.positiveCount = data[3].positiveCount;
    // $scope.negativeCount = data[3].negativeCount;
    // $scope.metroTracks = data[4];
    // $scope.metroWeather = data[5];
    // $scope.exampleData = createData($scope.positiveCount,$scope.negativeCount);
    // console.log($scope.data)
  }).error(function(err) {
    // console.log(err);
  })
}])