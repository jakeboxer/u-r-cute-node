var dotenv = require('dotenv')();
dotenv.load();

var ntwitter = require("ntwitter");

console.log("consumer_key:        " + process.env.U_R_CUTE_TWITTER_CONSUMER_KEY);
console.log("consumer_secret:     " + process.env.U_R_CUTE_TWITTER_CONSUMER_SECRET);
console.log("access_token_key:    " + process.env.U_R_CUTE_TWITTER_OAUTH_TOKEN);
console.log("access_token_secret: " + process.env.U_R_CUTE_TWITTER_OAUTH_TOKEN_SECRET);

var twitter = new ntwitter({
  consumer_key: process.env.U_R_CUTE_TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.U_R_CUTE_TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.U_R_CUTE_TWITTER_OAUTH_TOKEN,
  access_token_secret: process.env.U_R_CUTE_TWITTER_OAUTH_TOKEN_SECRET
});

twitter.get("https://api.twitter.com/1.1/statuses/mentions_timeline.json", {}, function (err, data) {
  console.log("mentions err:")
  console.log(err);
  console.log("mentions data:")
  console.log(data);
});
