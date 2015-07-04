'use strict';

var config = require('./config');
var TwitterUpdate = require('./lib/twitter');
var ForecastUpdate = require('./lib/forecast');

var forecast = new ForecastUpdate(config.forecast);

forecast.getUpdate()
.then(function(result) {
  let temperature = result.currently.temperature;
  let todayReport = result.daily.data[0];
  let date = new Date(todayReport.time*1000);
  console.info('==============================');
  console.info('Report for '+
    date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear()+
    ' ' + new Date().toLocaleTimeString().slice(0, 5));
  console.info(todayReport.summary);
  console.info(temperature + '°');
  console.info(todayReport.temperatureMin + '(' +
    todayReport.apparentTemperatureMin+') / ' +
    todayReport.temperatureMax + '(' +
    todayReport.apparentTemperatureMax + ')');
  console.info('Rain probability: ' + (todayReport.precipProbability*100)+'%');
  console.info('Winds: ' + todayReport.windSpeed+'m/s');
})
.catch(function(error) {
    console.error(error);
})
.then(function(){
  var twitter = new TwitterUpdate(config.twitter);
  return twitter.getUpdate();
})
.then(function(todaysTweets){
  if(todaysTweets.length > 0)
    for(let tweet of todaysTweets){
      console.log(' - '+tweet.text);
    }
  else
    console.warn('No tweets today.');
})
.catch(function(error) {
    console.error(error.stack);
});
