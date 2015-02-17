/**
 * PageController
 *
 * @description :: Server-side logic for managing pages
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
// var moby = require('moby');
var dotenv = require('dotenv');
dotenv.load();

var Twitter = require('twitter');

var twits = new Twitter ({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.ACCESS_TOKEN_SECRET
});

var LastFmNode = require('lastfm').LastFmNode;

var lastfm = new LastFmNode({
  api_key: 'apikey',    // sign-up for a key at http://www.last.fm/api
  secret: 'secret',
  useragent: 'appname/vX.X MyApp' // optional. defaults to lastfm-node.
});

module.exports = {
  index: function(req,res){
      // console.log(moby.search('furious'));
      // console.log(moby.reverseSearch('furious'));
      res.view('index');
    }
};
