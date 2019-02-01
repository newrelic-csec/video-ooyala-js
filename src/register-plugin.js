import * as nrvideo from 'newrelic-video-core'
import OoyalaTracker from './tracker'

export class NewrelicAnalyticsFramework {
  // old JS 3.5 notation enforced by Ooyala :(
  constructor (framework) {
    this.framework = framework
    this.id = null
    this.active = true

    this.tracker = new OoyalaTracker()
    nrvideo.Core.addTracker(this.tracker)

    this.getName = function () {
      return 'newrelic'
    }

    this.getVersion = function () {
      return this.tracker.getTrackerVersion()
    }

    this.setPluginID = function (id) {
      this.id = id
    }

    this.getPluginID = function () {
      return this.id
    }

    this.init = function () {
      if (this.framework) {
        this.framework.getRecordedEvents().forEach((event) => {
          this.tracker.onEvent(event.eventName, event.params)
        })
      }
    }

    this.setMetadata = function (data) {}

    this.processEvent = function (event, params) {
      try {
        this.tracker.onEvent(event, params)
      } catch (err) {
        nrvideo.Log.error(err)
      }
    }

    this.destroy = function () {
      nrvideo.Core.removeTracker(this.tracker)
      delete this.tracker
      delete this.framework
    }
  }
}

if (typeof OO !== 'undefined' && OO.Analytics) {
  OO.Analytics.RegisterPluginFactory(NewrelicAnalyticsFramework)
} else {
  nrvideo.Log.error('Ooyala v4 not found!')
}
