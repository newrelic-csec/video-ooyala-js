import * as nrvideo from 'newrelic-video-core'
import {version} from '../package.json'
import OoyalaAdsTracker from './ads'

export default class OoyalaTracker extends nrvideo.Tracker {
  constructor (player, options) {
    super(null, options)
    this.setAdsTracker(new OoyalaAdsTracker())
  }

  resetValues () {
    this.preload = null
    this.autoplay = null
    this.playhead = null
    this.src = null
    this.title = null
    this.duration = null
    this.live = null
    this.renditionName = null
    this.renditionBitrate = null
    this.renditionHeight = null
    this.renditionWidth = null
    this.muted = null
  }

  getTrackerName () {
    return 'ooyala'
  }

  getTrackerVersion () {
    return version
  }

  getPlayhead () {
    return this.playhead
  }

  getDuration () {
    return this.duration
  }

  getRenditionBitrate () {
    return this.renditionBitrate
  }

  getRenditionName () {
    return this.renditionName
  }

  getRenditionWidth () {
    return this.renditionWidth
  }

  getRenditionHeight () {
    return this.renditionHeight
  }

  isMuted () {
    return this.muted
  }

  isAutoplayed () {
    return this.autoplay
  }

  getPreload () {
    return this.preload
  }

  getTitle () {
    return this.player ? this.player.getTitle() : this.title
  }

  isLive () {
    return this.live
  }

  getSrc () {
    return this.src
  }

  getPlayerVersion () {
    if (typeof OO !== 'undefined') return OO.VERSION.core.rev
  }

  onEvent (event, params) {
    var param
    if (params && params[0]) param = params[0]

    // debug common events
    if (nrvideo.Log.level <= nrvideo.Log.Levels.DEBUG) {
      if (event !== 'video_stream_downloading' && event !== 'video_stream_position_changed') {
        nrvideo.Log.debug(event, param)
      }
    }

    // send-through to ad tracker
    this.adsTracker.onEvent(event, params)

    // switch
    if (!this.adsTracker.state.isRequested) { // not ads
      switch (event) {
        case 'video_player_created':
          this.autoplay = param.autoplay || false
          this.preload = param.preload || false
          this.sendPlayerReady()
          break

        case 'initial_playback_requested':
        case 'video_replay_requested':
          this.sendRequest()
          break

        case 'video_buffering_started':
          if (!this.state.isSeeking && param.streamUrl.startsWith(this.src)) {
            this.sendBufferStart()
          }
          break

        case 'video_buffering_ended':
          this.sendStart()
          this.sendBufferEnd()
          break

        case 'video_pause_requested':
          this.sendPause()
          break

        case 'video_playing':
          this.sendResume()
          break

        case 'video_seek_requested':
          this.sendSeekStart()
          break

        case 'video_seek_completed':
          this.sendSeekEnd()
          break

        case 'destroy':
        case 'playback_completed':
          this.sendEnd()
          this.resetValues()
          break

        case 'error':
        case 'authorization_error':
        case 'video_playback_error':
          this.sendError(param)
          break

        case 'video_stream_position_changed':
          this.playhead = param.streamPosition * 1000
          this.duration = param.totalStreamDuration * 1000
          break

        case 'video_content_metadata_updated':
          this.title = param.title
          this.duration = param.duration
          break

        case 'video_element_created':
          this.src = param.streamUrl
          break

        case 'stream_type_updated':
          this.live = !(param.streamType === 'vod')
          break

        case 'video_stream_bitrate_changed':
          this.renditionBitrate = param.bitrate
          this.renditionName = param.id
          this.renditionWidth = param.width
          this.renditionHeight = param.height
          this.sendRenditionChanged()
          break

        case 'volume_changed':
          this.muted = !(param.currentVolume)
          break
      }
    }
  }
}

// Static members
export {
  OoyalaAdsTracker
}
