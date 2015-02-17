/**
 * PageController
 *
 * @description :: Server-side logic for managing pages
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var dotenv = require('dotenv');
dotenv.load();

// var moby = require('moby');
var Twitter = require('twitter');
var LastFmNode = require('lastfm').LastFmNode;
var LastfmAPI = require('lastfmapi');
var sentiment = require('sentiment');
var nlp = require("nlp_compromise")

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

twits.stream('statuses/filter', {track: 'javascript'}, function(stream) {
  stream.on('data', function(tweet) {
    var pos = nlp.pos(tweet.text);
    var sent = sentiment(tweet.text);
    console.log("Part of speech: ", pos);
    console.log("sentiment: ", sent);
  });

  stream.on('error', function(error) {
    throw error;
  });
});

// lfm.geo.getMetros(function(err, metros){
//   console.log(metros)
// })

module.exports = {
  index: function(req,res){
      // console.log(moby.search('furious'));
      // console.log(moby.reverseSearch('furious'));
      res.view('index');
    },
    getTweets: function(searchTerm,callback){
        twits.get('search/tweets', {q: searchTerm +'-RT', 'result_type': 'mixed', lang: 'en', count: 200}, function(error, data, response) {

            // console.log(error);
            if (error) throw error;
            var tweetResults = data.statuses.filter(function(tweet){
                return true;//(tweet.text.indexOf("@") === -1);
            }).map(function(tweet) {
                return tweet.text;
            }).join(' ').split(" ").map(function(word){
                return word.replace('@','').replace('#','').replace('...', '').replace('.', '').replace(',', '').replace('…', '');
            }).filter(function(word){
                return (word.length > 3 && word.indexOf("://") === -1);
            });

            tweetResults = tweetResults.removeDuplicate();
            callback(tweetResults.join(' '));
        });
      }
  };
