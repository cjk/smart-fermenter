/* @flow */
import type { FermenterState } from '../types.js'

import * as R from 'ramda'
import signale from 'signale'

function bootstrapRuntimeState(prev: FermenterState, curr: FermenterState) {
  const prevRts = prev.rts

  /* Carry over current fermenter-is-active state from previous state */
  const rts = R.merge(curr.rts, {
    active: prevRts.active,
    status: prevRts.status === 'initializing' ? (prevRts.active ? 'running' : 'off') : prevRts.status,
  })

  const updateStateWith = (rts, devices = curr.devices) => R.merge(curr, { rts, devices })

  switch (rts.currentCmd) {
    case 'none': {
      /* Do nothing if no command has been received */
      break
    }
    case 'start': {
      if (!rts.active) {
        const newRts = R.merge(rts, {
          active: true,
          status: 'running',
          currentCmd: null,
          notifications: { [Date.now()]: { level: 'info', msg: 'Fermenter was started' } },
        })
        return updateStateWith(newRts)
      }
      break
    }
    case 'stop': {
      if (rts.active) {
        /* Make sure we switch all devices off as well as the fermenter-closet! */
        const devices = R.map(
          dev =>
            R.merge(dev, {
              shouldSwitchTo: 'off',
              willSwitch: true,
              isOn: false,
              lastSwitchAt: Date.now(),
            }),
          curr.devices
        )
        const newRts = R.merge(rts, {
          active: false,
          status: 'off',
          currentCmd: null,
          notifications: { [Date.now()]: { level: 'info', msg: 'Fermenter was stopped' } },
        })
        return updateStateWith(newRts, devices)
      }
      break
    }
    default: {
      // Warn on unknown but not empty commands
      if (rts.currentCmd) signale.warn(`[WARNING] Received unknown command <${rts.currentCmd}> - ignoring.`)
      break
    }
  }
  // Don't forget to return a meaningful state in any case, otherwise current-state will become null and the chain will
  // break.
  return updateStateWith(rts)
}

export default bootstrapRuntimeState
