'use strict';

var Promise = require('bluebird');
var dav = require('dav');

function toDate(string){
  const re = /(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z?/;
  return new Date(string.replace(re, '$1-$2-$3T$4:$5:$6Z'));
}

function toDavString(date){
  const re = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.\d{3}Z?/;
  return date.toISOString().replace(re, '$1$2$3T$4$5$6Z');
}

function stringToObject(calendarData){
  const reTime = /(?:DTSTART|DTEND).*?(\d{8}(T\d{6}Z?)?)/g;
  const reLocation = /LOCATION:(.*)/;
  const reSummary = /SUMMARY:(.*)/;
  const startStop = [];
  let match;
  while(match = reTime.exec(calendarData)){
    startStop.push(match[1]);
  }
  const locationMatch = calendarData.match(reLocation);
  const summaryMatch = calendarData.match(reSummary);

  return {
    start: toDate(startStop[0]),
    end: toDate(startStop[1]),
    location: locationMatch ? locationMatch[1].replace(/\\/g, '') : '',
    summary: summaryMatch ? summaryMatch[1] : ''
  };
}

function isToday(date){
  let now = new Date();
  return date.getDate() === now.getDate()
    && date.getMonth() === now.getMonth()
    && date.getFullYear() === now.getFullYear();
}

class CalendarUpdate {

  constructor(config){
    this.config = config;
    this.xhr = new dav.transport.Basic(
      new dav.Credentials({
        username: config.username,
        password: config.password
      })
    );
  }

  getUpdate() {
    const calendar = this.config.calendar;
    return dav.createAccount({
      server: this.config.hostname,
      xhr: this.xhr,
      loadObjects: true,
      // filters: [{
      //   type: 'comp-filter',
      //   attrs: { name: 'VCALENDAR' },
      //   children: [{
      //     type: 'comp-filter',
      //     attrs: { name: 'VEVENT' },
      //     children: [{
      //       type: 'time-range',
      //       attrs: {
      //         start: '20150724T000000Z',
      //         end: '20150726T230000Z'
      //       }
      //     }]
      //   }]
      // }]
    })
    .catch(console.error)
    .then(function (account) {
      const cal = account.calendars.find(function(cal){
        return cal.displayName === calendar;
      });
      return cal.objects.reduce(function(memo, ev){
        let event = stringToObject(ev.calendarData);
        if(isToday(event.start)) memo.push(event);
        return memo;
      }, []);
    })
    .catch(console.error);
  }
}

module.exports = CalendarUpdate;
