'use strict';

var request = require('request');
var moment = require('moment');

class WeatherChannel {
  constructor(){
  }

  static getPrevision(callback){
    var options = {
      url: 'http://www.infoclimat.fr/public-api/gfs/json',
      port: 80,
      method: 'GET',
      qs: {
        _ll: '48.8234808,2.3453789',
        _auth: 'CBJQR1QqACJecwcwVSMBKFA4ATQMegIlA38EZwxpVCkJYlEwVjZSNFY4WyYFKldhAy5UNwA7VWUBagZ+XS8CYwhiUDxUPwBnXjEHYlV6ASpQfgFgDCwCJQNnBGsMf1Q2CWNRMVYrUjFWP1sxBStXYQMzVDQAIFVyAWMGZV0zAmQIb1A0VDUAZV44B2dVegEqUGYBZAw7Am8DaARhDGNUPwlvUTJWN1IxVmhbPQUrV2EDMFQ9AD9VbQFkBmBdMAJ+CHRQTVREAH9ecQcnVTABc1B+ATQMbQJu',
        _c: '6bc0b4c2f1bd4aed9d10eabe2eff953e'
      }
    };

    request(options, function (err, response, body) {
      if(err)
        return callback(err);

      var previsions = JSON.parse(body);
      if(previsions.request_state != 200){
        callback(new Error('Error while getting infos from API: '
          +previsions.message));
      }
      else{
        delete previsions.request_state;
        delete previsions.request_key;
        delete previsions.message;
        delete previsions.model_run;
        delete previsions.source;
        callback(null, previsions);
      }
    });
  }
}

function getAveragePrevision(previsions) {
  var tempSum = 0, windSum = 0, rainSum = 0, snow = false;
  var length = Object.keys(previsions).length;
  for(let key in previsions){
    let prevision = previsions[key];
    console.log(key, prevision.temperature['2m']-273.15);
    console.log(prevision);
    tempSum += prevision.temperature['2m'];
    windSum += prevision.vent_moyen['10m'];
    rainSum += prevision.pluie;
    if(!snow && prevision.risque_neige === 'oui')
      snow = true;
  }

  return {
    temperature: tempSum/length,
    wind: windSum/length,
    rain: rainSum/length,
    snow: snow
  }
}

WeatherChannel.getPrevision(function (err, previsions) {
  if(err)
    console.error(err);
  else {
    var now = moment();
    var midday = now.set({'hour': 12, 'minute': 0, 'second': 0});
    var morning = {};
    var afternoon = {};
    for(let time of Object.keys(previsions)){
      var date = moment(time, 'YYYY-MM-DD HH:mm:ss');
      if(date.date() === now.date()){
        if(date < midday)
          morning[time] = previsions[time];
        else
          afternoon[time] = previsions[time];
      }
    }

    var morningAv = getAveragePrevision(morning);
    var afternoonAv = getAveragePrevision(afternoon);
    console.log(morningAv.temperature-273.15, afternoonAv.temperature-273.15);
  }
});
