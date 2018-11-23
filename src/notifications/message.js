// @flow

import type { Notification, RunTimeState } from '../types'

import * as R from 'ramda'

const notificationLens = R.lensProp(['notifications'])

function buildMessage(msg: string, level: string = 'notify'): Notification {
  return { level, msg }
}

function addNotification(msg: string, rts: RunTimeState): RunTimeState {
  const notifications = R.view(notificationLens, rts)

  return R.assoc('notifications', R.assoc([Date.now()], buildMessage(msg), notifications), rts)
}

export { addNotification, buildMessage }
