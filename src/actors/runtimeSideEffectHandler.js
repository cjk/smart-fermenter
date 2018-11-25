// @flow

/* Runtime notification handler - sends all collected message-events out as
   notifications */
import type { FermenterState, Notification, Notifications } from '../types'

import * as R from 'ramda'
import { createMessageEmitter } from '../notifications'
import logger from 'debug'

const info = logger('smt:fermenter:sideEffectsHandler')

const messageEmitter = createMessageEmitter()

// TODO: just pretending for now
// TODO: not taking care of malfunctioning devices yet - see '../watchdogs/deviceRunningTooLong.js'
function sendNotifications(notifications: Notifications): void {
  R.mapObjIndexed((n: Notification, ts, _) => {
    info(`Sending notification ${JSON.stringify(n)}`)
    messageEmitter.emit(n)
  }, notifications)
}

function handleRuntime(state: FermenterState): void {
  const {
    rts: { notifications },
  } = state
  // const notifications = buildEmergencyNotifications(rts).concat(rts.notifications)

  /* Send notifications from queue */
  sendNotifications(notifications)
}

export default handleRuntime
