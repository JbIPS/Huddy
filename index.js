'use strict';

const config = require('./config');
const TwitterUpdate = require('./lib/twitter');
const ForecastUpdate = require('./lib/forecast');
const CalendarUpdate = require('./lib/calendar');

const calendar = new CalendarUpdate(config.calendar);
const forecast = new ForecastUpdate(config.forecast);
const twitter = new TwitterUpdate(config.twitter);

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
.then(function(){
  return calendar.getUpdate();
})
.then(function(todaysEvent){
  if(todaysEvent.length > 0)
    for(let event of todaysEvent)
      console.log('- ', event.summary);
  else
    console.log('No events today');
})
.catch(function(error) {
    console.error(error.stack);
});
