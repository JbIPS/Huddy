'use strict';

var Promise = require('bluebird');
var Twitter = require('twitter');

class TwitterUpdate {

  constructor(config){
    this.twitterClient = new Twitter({
      consumer_key: config.consumerKey,
      consumer_secret: config.consumerSecret,
      access_token_key: config.accessToken,
      access_token_secret: config.accessTokenSecret
    });
    this.screenName = config.screenName;
  }

  getUpdate(options) {
    if(!options)
      options = {};
    return new Promise(function(resolved, rejected){
      this.twitterClient.get('statuses/user_timeline', {
        screen_name: this.screenName,
        count: options.count || 3,
        exclude_replies: options.noReplies !== undefined || true
      }, function(err, tweets, response){
        if(err)
          rejected(err);
        else{
          var today = new Date().getDate();
          var todaysTweets = tweets.filter(function (tweet){
            return new Date(tweet.created_at).getDate() === today;
          });
          resolved(todaysTweets)
        }
      });
    }.bind(this));
  }
}

module.exports = TwitterUpdate;
