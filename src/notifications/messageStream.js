/* eslint max-len: ["error", 105, 2, {"ignoreUrls": true}] */

import Kefir from 'kefir'
import request from 'request'
import signale from 'signale'

const slackURL = 'https://hooks.slack.com/services/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'

function createMessageEmitter() {
  /* Sends a notification-text via Slack as an incoming webhook (see
     https://api.slack.com/incoming-webhooks) */
  const postToSlack = text => {
    const payload = {
      text,
      icon_emoji: ':koala:',
      channel: '#smarthome',
      username: 'fermenter-closet',
    }

    request.post(slackURL, { body: payload, json: true }, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        signale.debug(`[notification-response]: ${body}`)
      } else {
        signale.debug(`[notification-response] - ERROR - code: ${response.statusCode} - `, body)
      }
    })
  }

  let emitter

  const stream = Kefir.stream(_emitter => {
    emitter = _emitter
    return () => {
      emitter = undefined
    }
  })

  stream.emit = text => {
    emitter && emitter.emit(text)
    return this
  }

  /* Send notifications via console / messenger (e.g. Slack). Never send more
     than one message in five seconds to avoid spamming. */
  stream.throttle(5000).onValue(notification => {
    signale.warn(`~~~~~~~ SENDING NOTIFICATION [${notification.level}]: ${notification.msg}`)
    // @if NODE_ENV='production'
    /* Only notify to Slack in production */
    postToSlack(notification.msg)
    // @endif
  })
  return stream
}

export default createMessageEmitter
