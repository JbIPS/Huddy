'use strict';

var Forecast = require('forecast.io-bluebird');
var config = require('./config');
var Twitter = require('twitter');

var forecastConfig = config.forecast;
var forecast = new Forecast({
    key: forecastConfig.apiKey
});

forecast.fetch(forecastConfig.latitude, forecastConfig.longitude, forecastConfig.options)
.then(function(result) {
  // TODO Get instantanate temperature
    let todayReport = result.daily.data[0];
    let date = new Date(todayReport.time*1000);
    console.info('==============================');
    console.info('Report for '+
      date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear());
    console.info(todayReport.summary);
    console.info(todayReport.temperatureMin + '(' +
      todayReport.apparentTemperatureMin+') / ' +
      todayReport.temperatureMax + '(' +
      todayReport.apparentTemperatureMax + ')');
    console.info('Rain probability: ' + todayReport.precipProbability+'%');
    console.info('Winds: ' + todayReport.windSpeed+'m/s');
})
.catch(function(error) {
    console.error(error);
});

var twitterConfig = config.twitter;
var twitter = new Twitter({
  consumer_key: twitterConfig.consumerKey,
  consumer_secret: twitterConfig.consumerSecret,
  access_token_key: twitterConfig.accessToken,
  access_token_secret: twitterConfig.accessTokenSecret
});

twitter.get('statuses/user_timeline', {
  screen_name: twitterConfig.screenName,
  count: 3,
  exclude_replies: true
}, function(err, tweets, response){
  // TODO Filter today's tweets, warn user when none
  if(err)
    console.error(err);
  else{
    for(let tweet of tweets){
      console.log(' - '+tweet.text);
    }
  }
});
