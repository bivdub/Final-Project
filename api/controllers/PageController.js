/**
 * PageController
 *
 * @description :: Server-side logic for managing pages
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
// var moby = require('moby');
var twitter = require('twitter');
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
