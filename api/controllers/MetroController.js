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

var lastfm = new LastFmNode({
  api_key: process.env.LASTFM_KEY,    // sign-up for a key at http://www.last.fm/api
  secret: process.env.LASTFM_SECRET,
  // useragent: 'appname/vX.X MyApp' // optional. defaults to lastfm-node.
});

module.exports = {

  getInfo: function(req, res) {
    var cityId = req.params.id;
    var cityName = '';
    var cityCountry = '';
    var searchTerms = ['I feel', 'feeling'];
    var lat ='';
    var lng ='';
    var outData = [];
    var toReturn = [];
    // console.log(sentimentScores)
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

        console.log(returnObj);
        return returnObj;
      }

      positiveArray = _.flatten(positiveArray);
      negativeArray = _.flatten(negativeArray);

      _.remove(positiveArray, function(n) { return n === 'feeling'; });

      var posCount = createSort(positiveArray);
      var negCount = createSort(negativeArray);
      _.sortBy(posCount, _.values(posCount));
      _.sortBy(negCount, _.values(negCount));

      // console.log(posCount);
      callback(null, {scores: scores, positiveArray: positiveArray, negativeArray: negativeArray, positiveCount: posCount, negativeCount: negCount});

    }

    var getLFMdata = function(callback) {
      lfm.geo.getMetroTrackChart({metro: cityName, country: cityCountry, limit:10}, function(err, tracks){
        // console.log(tracks);
        var output = tracks.track.map(function(el) {
          return {trackName: el.name, artistName: el.artist.name}
        })
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
        // console.log('Errors',err);
        // console.log('Results',results);
        // console.log(outData);
        toReturn.push(results);
        res.send(results);
      });

  }

};

