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
  const temperature = result.currently.temperature | 0;
  const todayReport = result.daily.data[0];
  const date = new Date(todayReport.time*1000);
  const meteoBlock = document.getElementById('meteo');
  const title = document.querySelector('#meteo h2');
  title.textContent += date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear();
  document.querySelector('#meteo h3').textContent = new Date().toLocaleTimeString().slice(0, 5);

  const summary = document.getElementById('summary');
  summary.textContent = todayReport.summary;

  const temperatureBlock = document.getElementById('temperature');
  temperatureBlock.textContent = temperature + '°';
  const feltTemp = document.getElementById('feltTemp');
  feltTemp.querySelector('.minTemp').textContent = (todayReport.temperatureMin | 0) + ' / ';
  feltTemp.querySelector('.maxTemp').textContent = (todayReport.temperatureMax | 0 );

  const rain = document.getElementById('rain');
  console.log(todayReport.rain);
  rain.textContent += (todayReport.precipProbability * 100) + '%';

  const wind = document.getElementById('wind');
  wind.textContent += todayReport.windSpeed+'m/s';

  const icon = document.getElementById('icon');
  icon.src = '../assets/'+todayReport.icon+'.png';
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
