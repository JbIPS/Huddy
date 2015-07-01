'use strict';

var Forecast = require('forecast.io-bluebird');
var config = require('./config');

var forecast = new Forecast({
    key: config.apiKey
});

var time = new Date('2015-07-01T07:00:00.000Z').getTime() / 1000;

forecast.fetch(config.latitude, config.longitude, config.options)
.then(function(result) {
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
