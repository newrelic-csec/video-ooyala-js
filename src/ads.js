import * as nrvideo from 'newrelic-video-core'
import { version } from '../package.json'

export default class OoyalaAdsTracker extends nrvideo.Tracker {
  getTrackerName () {
    return 'ooyala-ads'
  }

  getTrackerVersion () {
    return version
  }

  getDuration () {
    return this.duration
  }

  getResource () {
    return this.resource
  }

  getPlayhead () {
    return this.playhead
  }

  getTitle () {
    return this.title
  }

  getPosition () {
    if (this.position) {
      return this.position
    } else if (this.parentTracker.state.isStarted) {
      return nrvideo.Constants.AdPositions.MID
    } else {
      return nrvideo.Constants.AdPositions.PRE
    }
  }

  onEvent (event, params) {
    var param
    if (params && params[0]) param = params[0]

    switch (event) {
      case 'ad_break_started':
        this.sendAdBreakStart()
        break

      case 'ad_break_ended':
        this.sendAdBreakEnd()
        break

      case 'ad_request':
        this.sendRequest()
        break
      case 'ad_started':
        this.sendRequest()
        this.sendStart()
        break

      case 'ad_end':
        this.sendEnd()
        break

      case 'ad_skipped':
        this.sendEnd({ skipped: true })
        break

      case 'ad_clickthrough_opened':
        this.sendAdClick()
        break

      case 'ad_request_error':
      case 'ad_error':
        this.sendError(param)
        break

      case 'ad_request_empty':
        this.emit('AD_EMPTY', this.getAttributes())
        break
    }
  }
}
