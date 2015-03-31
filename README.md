# Mood-Mining

[Visit Site](http://mood-mining.herokuapp.com) 

###Description
Our goal with Mood Mining was to create engaging visualization tools for subjective and somewhat abstract data sets. We used Twitter and Weather API’s and searched for 'I feel' and 'feeling' statements, filtered by region, and by current weather. After amassing our data, we passed all of our ‘feelings’ through an algorithm to evaluate the overall positive or negative score of each term. For our Music visualization we varied our search terms slightly. We searched for 'listening' and 'listen' and further filtered the data with the top artists from the LastFm API, by metro region. We then applied our sentiment algorithm to the statements from Twitter, related to artist, and evaluated the overall positive or negative response to each artist.

###Challenges:
D3 is a challenge! The learning curve for D3 is really steep. Since we're fans of making things complicated, we not only used D3, we used the NVD3 directive, as well as a deprecated version of D3. The charts we chose to use required different versions to function. Aside from the obvious challenge of using 3 D3 libraries, we also had to learn the separate funcions for each chart. Tooltips, sizing of the SVG containers using functions, and responsiveness were moving targets for each chart. We ended up using jQuery as a hack to make re-sizing work better for our word cloud.

###Wishlist:
We are still working on getting the location out of the tooltips for the Music Code Flower chart, and working on the SVG container sizing. We are also working on trying to filter language better in Twitter to eliminate cursing and or racism or bigotry. Occasionally we get results that are less than ideal.

###Tools:
Javascript, MongoDb, Sails, AngularJS, jQuery, Twitter API, lastFm API, Weather API, and Sentiment Analysis API.
