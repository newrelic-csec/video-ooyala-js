import * as nrvideo from 'newrelic-video-core'
import Tracker from './tracker'
import './register-plugin'

nrvideo.OoyalaTracker = Tracker
module.exports = nrvideo
