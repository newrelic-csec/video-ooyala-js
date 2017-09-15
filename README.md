# newrelic-video-ooyala [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)
#### [New Relic](http://newrelic.com) video tracking for ooyala

## Requirements
This video monitor solutions works on top of New Relic's **Browser Agent**.

## Usage
Load **scripts** inside `dist` folder into your page. Do it **AFTER** loading Ooyala's player. 
```html
<script src="../dist/newrelic-video-ooyala.min.js"></script>
```
That's it, any ooyala video loaded into the page will automatically send metrics.

> If `dist` folder is not included, run `npm i && npm run build` to build it.
