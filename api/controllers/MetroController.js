/**
 * MetroController
 *
 * @description :: Server-side logic for managing Metroes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */


var geocoder = require('geocoder');
var Twitter = require('twitter');
var LastFmNode = require('lastfm').LastFmNode;
var LastfmAPI = require('lastfmapi');
var sentiment = require('sentiment');
var weather = require('weather-js');
var fs = require('fs');
var tinycolor = require("tinycolor2");
var sentimentScores = {};

fs.readFile('./node_modules/sentiment/build/AFINN.json', function (err, data) {
  if (err) throw err;
  sentimentScores = JSON.parse(data);
});
// var nlp = require("nlp_compromise")

var twits = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

var lfm = new LastfmAPI({
  'api_key' : process.env.LASTFM_KEY,
  'secret' : process.env.LASTFM_SECRET,
});


module.exports = {

  get: function(req, res) {
    Metro.find().limit(999).exec(function(err, data){
      res.send(data);
    });
  },

  getBasicInfo: function(req, res) {
    var cityId = req.params.id;
    var cityName = '';
    var cityCountry = '';
    var searchTerms = ['I feel', 'feeling'];
    var lat ='';
    var lng ='';
    var outData = [];
    var toReturn = [];

    var findMetro = function(callback) {
      // console.log(cityId)
      Metro.find({where:{'id': cityId}}).then(function(data){
        // console.log(data[0].name);
        cityName = data[0].name;
        cityCountry = data[0].country;
        // return data;
        callback(null, data);
      });
    }

    var getGeocode = function(callback) {
        // console.log('TEST', cityName);
        geocoder.geocode(cityName, function(err, data) {
        // console.log(err);
        // console.log(data);
        lat = data.results[0].geometry.location.lat;
        lng = data.results[0].geometry.location.lng;
        // return [lat,lng];
        callback(null, data);
      });
      }

      var getTwitterData = function(callback){
        async.each(searchTerms,function(item, callback) {
          var geocode = lat+','+lng+',100mi';
        // console.log(geocode)
        twits.get('search/tweets', {q: item, lang: 'en', geocode:geocode, count: 100}, function(error, data, response) {
          // console.log(geocode);
          // console.log(response);
          // console.log(error);
          // console.log(data);
          if (error) throw error;
          var tweetResults = data.statuses.map(function(tweet) {
            return tweet.text.split(' ').map(function(word){
              return word.replace('@','').replace('#','').replace('...', '').replace('.', '').replace(',', '').replace('…', '').replace('RT', '');
            }).join(' ');
          })
          outData.push(tweetResults);
          callback();
        })
      }, function(err){
        // console.log(err);
        callback(null);
      });
      }

      var sentimentAnalysis = function(callback){
        tempArray = _.flatten(outData);
        scores = [];
        positiveArray = [];
        negativeArray = [];

        var sent = tempArray.map(function(tweet){
          return sentiment(tweet);
        });

        sent.forEach(function(el){
          scores.push(el.score);
          if(el.positive.length > 0){
            positiveArray.push(el.positive);
          }
          if(el.negative.length > 0){
            negativeArray.push(el.negative);
          }
        })

        var createSort = function(arr) {
        // console.log(sentimentScores)
        var returnObj = {};
        for(var i = 0; i< arr.length; i++) {
          var word = arr[i];
          var numScore = sentimentScores[word]
          // console.log(numScore);

          if (returnObj[numScore]) {
            if (returnObj[numScore][word]) {
              returnObj[numScore][word]++;
            } else {
              returnObj[numScore][word] = 1
            }
          } else {
            returnObj[numScore] = {};
            returnObj[numScore][word] = 1
          }
        }

        // console.log(returnObj);
        return returnObj;
      }

      positiveArray = _.flatten(positiveArray);
      negativeArray = _.flatten(negativeArray);

      _.remove(positiveArray, function(n) { return n === 'feeling' || n === 'like'; });

      var posCount = createSort(positiveArray);
      var negCount = createSort(negativeArray);
      _.sortBy(posCount, _.values(posCount));
      _.sortBy(negCount, _.values(negCount));
      callback(null, {scores: scores, positiveArray: positiveArray, negativeArray: negativeArray, positiveCount: posCount, negativeCount: negCount});
    }

    var getLFMdata = function(callback) {
      lfm.geo.getMetroTrackChart({metro: cityName, country: cityCountry, limit:10}, function(err, tracks){
        console.log(tracks);
        if(tracks.track) {
          var output = tracks.track.map(function(el) {
            return {trackName: el.name, artistName: el.artist.name}
          })
        }
        callback(null, output);
      })
    }

    var getWeather = function(callback) {
      weather.find({search: cityName, degreeType: 'F'}, function(err, result) {
        if(err) console.log(err);
        // console.log(JSON.stringify(result, null, 2));

        callback(null, result[0].current)
      });
    }

    async.series([findMetro,getGeocode,getTwitterData,sentimentAnalysis,getLFMdata,getWeather],
      function(err,results) {
        toReturn.push(results);
        res.send(results);
    });

  },

  getWeatherInfo: function(req,res) {

    var cityId = req.params.id;
    var cityName = '';
    var cityCountry = '';
    var searchTerms = ['weather'];
    var lat ='';
    var lng ='';
    var outData = [];
    var toReturn = [];

    var findMetro = function(callback) {
      // console.log(cityId)
      Metro.find({where:{'id': cityId}}).then(function(data){
        // console.log(data[0].name);
        cityName = data[0].name;
        cityCountry = data[0].country;
        // return data;
        callback(null, data);
      });
    }

    var getGeocode = function(callback) {
        // console.log('TEST', cityName);
        geocoder.geocode(cityName, function(err, data) {
        // console.log(err);
        // console.log(data);
        lat = data.results[0].geometry.location.lat;
        lng = data.results[0].geometry.location.lng;
        // return [lat,lng];
        callback(null, data);
      });
    }

    var getWeather = function(callback) {
      weather.find({search: cityName, degreeType: 'F'}, function(err, result) {
        if(err) console.log(err);
        // console.log(result);
        // console.log(JSON.stringify(result, null, 2));
        searchTerms.push(result[0].current.skycode)
        callback(null, result[0].current)
      });
    }

    var getTwitterData = function(callback){
      async.each(searchTerms,function(item, callback) {
        var geocode = lat+','+lng+',100mi';
        twits.get('search/tweets', {q: item, lang: 'en', geocode:geocode, count: 100}, function(error, data, response) {
          if (error) throw error;
          var tweetResults = data.statuses.map(function(tweet) {
            return tweet.text.split(' ').map(function(word){
              return word.replace('@','').replace('#','').replace('...', '').replace('.', '').replace(',', '').replace('…', '').replace('RT', '').replace(/[^A-Za-z]/g, "");
            }).filter(function(word){return word.length > 3});;
        })
        outData.push(_.uniq(_.flatten(tweetResults)));
        callback(null, _.uniq(tweetResults));
      })
    },function(err){
        // console.log(err);
        callback(null);
      });
    }

    var sentimentAnalysisWeather = function(callback){
      tempArray = _.flatten(outData);
      scores = [];
      positiveArray = [];
      negativeArray = [];

      var sent = tempArray.map(function(tweet){
        return sentiment(tweet);
      });

      sent.forEach(function(el){
        scores.push(el.score);
        if(el.positive.length > 0){
          positiveArray.push(el.positive);
        }
        if(el.negative.length > 0){
          negativeArray.push(el.negative);
        }
      })

      positiveArray = _.flatten(positiveArray);
      negativeArray = _.flatten(negativeArray);

      _.remove(positiveArray, function(n) { return n === 'feeling' || n === 'like'; });

      outData = positiveArray.concat(negativeArray);

      callback(null, {scores: scores, positiveArray: positiveArray, negativeArray: negativeArray});
    }

    async.series([findMetro,getGeocode,getWeather,getTwitterData,sentimentAnalysisWeather],
      function(err,results) {
        toReturn.push(results);
        res.send(outData);
    });

  },

  //GETMUSIC PATH

  getMusicInfo: function(req, res) {

    var cityId = req.params.id;
    var cityName = '';
    var cityCountry = '';
    var searchTerms = [];
    var lat ='';
    var lng ='';
    var outData = [];
    var toReturn = [];
    var outputJSON = {};

    var sentimentAnalysis = function(wordArray){
        tempArray = _.flatten(wordArray);
        scores = [];
        positiveArray = [];
        negativeArray = [];

        var sent = tempArray.map(function(tweet){
          return sentiment(tweet);
        });

        sent.forEach(function(el){
          scores.push(el.score);
          if(el.positive.length > 0){
            positiveArray.push(el.positive);
          }
          if(el.negative.length > 0){
            negativeArray.push(el.negative);
          }
        })

        // var createSort = function(arr) {
        // // console.log(sentimentScores)
        // var returnObj = {};
        // for(var i = 0; i< arr.length; i++) {
        //   var word = arr[i];
        //   var numScore = sentimentScores[word]
        //   // console.log(numScore);

        //   if (returnObj[numScore]) {
        //     if (returnObj[numScore][word]) {
        //       returnObj[numScore][word]++;
        //     } else {
        //       returnObj[numScore][word] = 1
        //     }
        //   } else {
        //     returnObj[numScore] = {};
        //     returnObj[numScore][word] = 1
        //   }
        // }

        // console.log(returnObj);
      //   return returnObj;
      // }

      positiveArray = _.flatten(positiveArray).sort();
      negativeArray = _.flatten(negativeArray).sort();
      return ({pos: positiveArray, neg: negativeArray});
      // _.remove(positiveArray, function(n) { return n === 'feeling' || n === 'like'; });

      // var posCount = createSort(positiveArray);
      // var negCount = createSort(negativeArray);
      // _.sortBy(posCount, _.values(posCount));
      // _.sortBy(negCount, _.values(negCount));
      // callback(null, {scores: scores, positiveArray: positiveArray, negativeArray: negativeArray, positiveCount: posCount, negativeCount: negCount});
    }

    var createJSONdata = function(callback) {
      var globalCount = 0;
      var pCount = 0;
      var nCount = 0;

      outputJSON.name = cityName;
      outputJSON.children = [];

      for (var i = 0; i <searchTerms.length; i++) {
        var aCount = 0;
        // var currentArtist = searchTerms[i];
        outputJSON.children
        .push({'name': searchTerms[i],
               children: [{'name': 'positive', 'children': []},
                          {'name': 'negative', 'children': []}]
              });
        // console.log(outData.length);
        var sentimentObj = sentimentAnalysis(outData[i]);
        // console.log(sentimentObj);
        var currentCount = 1;
        for (var j = 0; j<sentimentObj.pos.length; j++) {
          if (sentimentObj.pos[j+1] !== sentimentObj.pos[j]) {
            var weight = sentimentScores[sentimentObj.pos[j]];
            console.log('weight', weight)
            var size = (currentCount * weight * 10);
            globalCount += size;
            pCount += size;
            // console.log(outputJSON.children[i]);
            outputJSON.children[i].children[0].children.push({'name': sentimentObj.pos[j], 'size': size});
            currentCount = 1;
          } else {
            currentCount++;
          }
        }
        currentCount = 1;
        for (var k = 0; k<sentimentObj.neg.length; k++) {
          if (sentimentObj.neg[k+1] !== sentimentObj.neg[k]) {
            var weight = Math.abs(sentimentScores[sentimentObj.neg[k]]);
            var size = currentCount * weight * 10;
            globalCount += size;
            nCount += size;
            // console.log(outputJSON.children[i]);
            outputJSON.children[i].children[1].children.push({'name': sentimentObj.neg[k], 'size': size});
            currentCount = 1;
          } else {
            currentCount++;
          }
        }
        // console.log(pCount)
        outputJSON.children[i].children[0].size = pCount > 0 ? pCount : 5;
        outputJSON.children[i].children[1].size = nCount > 0 ? nCount : 5;
        outputJSON.children[i].size = (pCount + nCount) > 0 ? (pCount+nCount) : 10;
        pCount = 0;
        nCount = 0;
        console.log(outputJSON.children[i].children);
      }
      outputJSON.size = globalCount;
      // console.log(outputJSON);
      callback(null, outputJSON);
    }

    var getLFMdata = function(callback) {
      lfm.geo.getMetroArtistChart({metro: cityName, country: cityCountry, limit:10}, function(err, artists){
        // console.log(artists);
        if(artists.artist) {
          var output = artists.artist.map(function(el) {
            return el.name;
          })
        }
        // console.log(output);
        searchTerms = output;
        // console.log(searchTerms);
        callback(null, output);
      })
    }

    var findMetro = function(callback) {
      // console.log(cityId)
      Metro.find({where:{'id': cityId}}).then(function(data){
        // console.log(data);
        cityName = data[0].name;
        cityCountry = data[0].country;
        // return data;
        callback(null, data);
      });
    }

    var getGeocode = function(callback) {
        // console.log('TEST', cityName);
        geocoder.geocode(cityName, function(err, data) {
        // console.log(err);
        // console.log(data);
        lat = data.results[0].geometry.location.lat;
        lng = data.results[0].geometry.location.lng;
        // return [lat,lng];
        callback(null, data);
      });
    }


  var getTwitterData = function(callback){
      async.each(searchTerms,function(item, callback) {
        var geocode = lat+','+lng+',100mi';
        twits.get('search/tweets', {q: item, lang: 'en', geocode:geocode, count: 100}, function(error, data, response) {
          if (error) throw error;
          var tweetResults = data.statuses.map(function(tweet) {
            return tweet.text.split(' ').map(function(word){
              return word.replace('RT', '').replace(/[^A-Za-z]/g, "");
            });
        })
        // console.log(_.flatten(tweetResults));
        // console.log(outData[0]);
        outData.push(_.flatten(tweetResults));
        // console.log(outData)
        // console.log(outData[9]);
        callback(null, tweetResults);
      })
    },function(err){
        // console.log(err);
        callback(null);
      });
    }


    async.series([findMetro,getGeocode,getLFMdata,getTwitterData, createJSONdata],
      function(err,results) {
        // console.log(outData);
        toReturn.push(results);
        console.log(outputJSON);
        res.send(outputJSON);
    });

  },

};

