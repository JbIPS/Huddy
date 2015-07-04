'use strict';

var Forecast = require('forecast.io-bluebird');

class ForecastUpdate {
  constructor(config){
    this.forecast = new Forecast({
        key: config.apiKey
    });
    this.config = config;
  }

  getUpdate(){
    return this.forecast.fetch(
      this.config.latitude,
      this.config.longitude,
      this.config.options);
  }
}

module.exports = ForecastUpdate;
