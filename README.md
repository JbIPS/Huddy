# Huddy

## Project Presentation

This project aims to give you all the informations you'll need for you day in a glimpse: weather forecast, today events or traffic status.

## How to run it

First, you'll need to configure it with a `config.json` file at the root of the project.
This file will look like
```js
{
  "forecast": {
    "apiKey": "15ea3...", // Your Forecast.io API Key
    "longitude": 2.29500,
    "latitude": 48.85795,
    "options": {
      // Any options you want to pass to your query
    }
  },
  "twitter": { // Your Twitter app credentials
    "consumerKey": "D58Eff...",
    "consumerSecret": "cvga2...",
    "accessToken": "25689...",
    "accessTokenSecret": "Iru874...",
    "screenName": "RERB"
  }
}
```
For more documentation on the Forecast API, see the [Dark Sky Forecast API](https://developer.forecast.io/docs/v2).

Then you can just run
```
node index.js
```

## License

This software is distributed with a MIT license. Feel free to share & modify it! PR are welcomed.
