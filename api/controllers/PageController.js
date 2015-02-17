/**
 * PageController
 *
 * @description :: Server-side logic for managing pages
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var moby = require('moby');

module.exports = {
  index: function(req,res){
      console.log(moby.search('furious'));
      console.log(moby.reverseSearch('furious'));
      res.view('index');
    }
};
