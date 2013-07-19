var dotenv = require('dotenv')();
dotenv.load();

var _ = require('underscore'),
  ntwitter = require("ntwitter");

// jshint multistr: true
var FLOWER = "\
     .-..-.\n\
   ( \\'--'/ )\n\
 ( '....-...' )\n\
   <'-.,.->\n\
       `\\\\\n\
       ```\\\\\n\
         _\\\\```\n\
            \\\\";

var TWEET_REGEX = /^@u_r_cute send flowers to @([A-Za-z0-9_]{1,15})$/i

// jshint multistr: true
console.log("\
###############\n\
# Credentials #\n\
###############\n\
\n\
consumer_key:        " + process.env.U_R_CUTE_TWITTER_CONSUMER_KEY + "\n\
consumer_secret:     " + process.env.U_R_CUTE_TWITTER_CONSUMER_SECRET + "\n\
access_token_key:    " + process.env.U_R_CUTE_TWITTER_OAUTH_TOKEN + "\n\
access_token_secret: " + process.env.U_R_CUTE_TWITTER_OAUTH_TOKEN_SECRET + "\n\
\n");

var twitter = new ntwitter({
  consumer_key: process.env.U_R_CUTE_TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.U_R_CUTE_TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.U_R_CUTE_TWITTER_OAUTH_TOKEN,
  access_token_secret: process.env.U_R_CUTE_TWITTER_OAUTH_TOKEN_SECRET
});

var tweetIDsReplyingTo = [];
var tweetIDsRepliedTo = [];

function checkDone() {
  if (tweetIDsReplyingTo.length < 1) {
    console.log("DONE!!!\n");
    setTimeout(respondToMentions, 90000); // Check once every 1.5 minutes
  } else {
    console.log("Still have tweets to reply to\n");
  }
}

function respondToMentions() {
  // Get the mentions timeline
  twitter.get("https://api.twitter.com/1.1/statuses/mentions_timeline.json", {}, function (err, data) {
    if (err !== null) {
      // Get out early if there was an error
      console.log("Error loading mentions timeline:")
      console.log(err);
      checkDone();
      return null;
    }

    console.log("Mentions timeline loaded at " + (new Date()) + ". Processing...\n---\n")

    // Loop over each tweet mention
    data.forEach(function (tweet) {
      var tweetId = tweet.id;

      console.log("Tweet " + tweetId + " from @" + tweet.user.screen_name + ": " + tweet.text);

      if (_.contains(tweetIDsRepliedTo, tweetId)) {
        console.log("Already replied to tweet " + tweetId);
        checkDone();
      } else {
        // We haven't replied to this tweet yet, so reply to it if it matches
        // the regex.
        console.log("Haven't replied to tweet " + tweetId + " yet.");

        var matches = tweet.text.match(TWEET_REGEX);

        if (matches === null) {
          console.log("Regex not matched. Ignoring.\n");
          checkDone();
        } else {
          var toUsername = matches[1];
          var fromUsername = tweet.user.screen_name;
          var text = "@" + toUsername + "\n\n" + FLOWER + "\n\nFrom: @" + fromUsername;

          tweetIDsReplyingTo.push(tweetId);

          console.log("Replying with:\n---\n" + text + "\n");

          twitter.updateStatus(text, function (err, data) {
            // Now we've replied to the tweet, so record it
            tweetIDsReplyingTo.splice(tweetIDsReplyingTo.indexOf(tweetId), 1);
            tweetIDsRepliedTo.push(tweetId);

            checkDone();
          });
        }
      }
    });
  });
}

respondToMentions();
