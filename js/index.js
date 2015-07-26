'use strict';

// Paths are relative to index.html
const config = require('../config');
const TwitterUpdate = require('../js/lib/twitter');
const ForecastUpdate = require('../js/lib/forecast');
const CalendarUpdate = require('../js/lib/calendar');

const calendar = new CalendarUpdate(config.calendar);
const forecast = new ForecastUpdate(config.forecast);
const twitter = new TwitterUpdate(config.twitter);

forecast.getUpdate()
.then(function(result) {
  let temperature = result.currently.temperature;
  let todayReport = result.daily.data[0];
  let date = new Date(todayReport.time*1000);
  let meteoBlock = document.getElementById('meteo');
  let title = document.querySelector('#meteo h2');
  title.textContent += date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear()+
    ' ' + new Date().toLocaleTimeString().slice(0, 5);

  let summary = document.getElementById('summary');
  summary.textContent = todayReport.summary;

  let temperatureBlock = document.getElementById('temperature');
  temperatureBlock.textContent = temperature + '°\n' +
   todayReport.temperatureMin + '(' +
    todayReport.apparentTemperatureMin+') / ' +
    todayReport.temperatureMax + '(' +
    todayReport.apparentTemperatureMax + ')';

  let rain = document.getElementById('rain');
  rain.textContent = todayReport.rain;

  let wind = document.getElementById('wind');
  wind.textContent = todayReport.windSpeed+'m/s';
})
.catch(function(error) {
    console.error(error);
})
.then(function(){
  return twitter.getUpdate();
})
.then(function(todaysTweets){
  let twitterBlock = document.getElementById('tweets');
  if(todaysTweets.length > 0){
    let list = document.createElement('ul');
    for(let tweet of todaysTweets){
      let item = document.createElement('li');
      item.textContent = tweet.text;
      list.appendChild(item);
    }
    twitterBlock.appendChild(list);
  }
  else{
    let p = document.createElement('p');
    p.textContent = 'No tweets today.';
    twitterBlock.appendChild(p);
  }
})
.then(function(){
  return calendar.getUpdate();
})
.then(function(todaysEvent){
  let calendarBlock = document.getElementById('events');
  if(todaysEvent.length > 0){
    let list = document.createElement('ul');
    for(let event of todaysEvent){
      let item = document.createElement('li');
      item.textContent = event.summary;
      list.appendChild(item);
    }
    calendarBlock.appendChild(list);
  }
  else{
    let p = document.createElement('p');
    p.textContent = 'No events today';
    calendarBlock.appendChild(p);
  }
})
.catch(function(error) {
    console.error(error.stack);
});
