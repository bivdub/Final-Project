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

// twits.stream('statuses/filter', {track: 'I feel'}, function(stream) {
//   stream.on('data', function(tweet) {
//     console.log(tweet.text);
//   });

//   stream.on('error', function(error) {
//     throw error;
//   });
// });

lfm.geo.getMetros(function(err, metros){
  console.log(metros)
})

module.exports = {
  index: function(req,res){
      // console.log(moby.search('furious'));
      // console.log(moby.reverseSearch('furious'));
      res.view('index');
    }
  };
