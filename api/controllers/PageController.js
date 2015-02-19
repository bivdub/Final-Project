/**
 * PageController
 *
 * @description :: Server-side logic for managing pages
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
// var dotenv = require('dotenv');
// dotenv.load();

// var moby = require('moby');

// twits.stream('statuses/filter', {track: 'javascript'}, function(stream) {
//   stream.on('data', function(tweet) {


// twits.get('search/tweets', {q: 'coffee', lang: 'en', geocode:"47.6097,-122.3331,100mi", count: 100}, function(error, data, response) {

//     // console.log(error)
//     console.log(data.statuses)
//     if (error) throw error;
//     var tweetResults = data.statuses.map(function(tweet) {
//       return tweet.text.split(' ').map(function(word){
//         return word.replace('@','').replace('#','').replace('...', '').replace('.', '').replace(',', '').replace('…', '').replace('RT', '');
//       }).join(' ');
//     })

//     var sent = tweetResults.map(function(tweet){
//       return sentiment(tweet);
//     });

//     sent.forEach(function(el){
//       console.log("sentiment: ", el.score);
//     });
// });


// lfm.geo.getMetros(function(err, metros){
//   console.log(metros)
// })

module.exports = {
  index: function(req,res){

      // var terms=['coffee','kittens'];

      // async.map(terms,function(term,callback){


      //   twits.get('search/tweets', {q: term, lang: 'en', geocode:"47.6097,-122.3331,100mi", count: 10}, function(error, data, response) {

      //     // console.log(error)
      //     // console.log(data.statuses)
      //     if (error) throw error;
      //     var tweetResults = data.statuses.map(function(tweet) {
      //       return tweet.text.split(' ').map(function(word){
      //         return word.replace('@','').replace('#','').replace('...', '').replace('.', '').replace(',', '').replace('…', '').replace('RT', '');
      //       }).join(' ');
      //     })

      //     var sent = tweetResults.map(function(tweet){
      //       return sentiment(tweet);
      //     });

      //     // sent.forEach(function(el){
      //     //   console.log("sentiment: ", el.score);
      //     // });
      //     callback(null,{tweets: tweetResults, sentiment: sent})
      //   });
      // },function(err,result){
      //   //final callback
      //   console.log(result[0].sentiment)
      // });
        res.view('index');
      // console.log(moby.search('furious'));
      // console.log(moby.reverseSearch('furious'));
    },
  // getTweets: function(searchTerm,callback){
  //     twits.get('search/tweets', {q: searchTerm +'-RT', 'result_type': 'mixed', lang: 'en', count: 200}, function(error, data, response) {

  //         // console.log(error);
  //         if (error) throw error;
  //         var tweetResults = data.statuses.filter(function(tweet){
  //             return true;//(tweet.text.indexOf("@") === -1);
  //         }).map(function(tweet) {
  //             return tweet.text;
  //         }).join(' ').split(" ").map(function(word){
  //             return word.replace('@','').replace('#','').replace('...', '').replace('.', '').replace(',', '').replace('…', '');
  //         }).filter(function(word){
  //             return (word.length > 3 && word.indexOf("://") === -1);
  //         });

  //         tweetResults = tweetResults.removeDuplicate();
  //         callback(tweetResults.join(' '));
  //     });
  //   }
  };
