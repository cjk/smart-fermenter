// @flow

/* Runtime notification handler - sends all collected message-events out as
   notifications */
import type { FermenterState, Notification, Notifications } from '../types.js'

import * as R from 'ramda'
import signale from 'signale'
import { createMessageEmitter } from '../notifications/index.js'

const messageEmitter = createMessageEmitter()

// TODO: not taking care of malfunctioning devices yet - see '../watchdogs/deviceRunningTooLong.js'
function sendNotifications(notifications: Notifications): void {
  R.mapObjIndexed((n: Notification, ts, _) => {
    signale.info(`Sending notification ${JSON.stringify(n)}`)
    // TODO: just pretending for now
    // messageEmitter.emit(n)
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
