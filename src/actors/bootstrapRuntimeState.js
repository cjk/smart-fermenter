/* @flow */
import type { FermenterState } from '../types.js'

import * as R from 'ramda'
import signale from 'signale'

// This block allows us the toggle switch the fermenter on/off from a local console
var toggleOnOff = false
// Listen to local system-signal and activate toggleOnOff-variable if received
process.on('SIGUSR2', () => {
  signale.info('Received SIGUSR2 from system...')
  toggleOnOff = true
})
// Reacts to process-signaling by either setting currentCmd to 'start' or 'stop' here depending on if fermenter was on
// or off before
const maybeToggleFermenterFromSignal = (isActive, currentCmd) => {
  // NOTE we only interfere if there is no competing command already being sent;
  // Also make sure we always return a non-undefined state, even if we received an empty one
  if (!toggleOnOff || currentCmd != 'none') return currentCmd
  toggleOnOff = false
  return isActive ? 'stop' : 'start'
}

function bootstrapRuntimeState(prev: FermenterState, curr: FermenterState) {
  const prevRts = prev.rts

  // Set currentCmd. NOTE it may have been set remotely already (using peer / synced state) so we try to preserve this
  // value. However, if the current command is empty / 'none', we allow it to be set from the console by sending SIGUSR2
  // (see above)
  const newCmd = maybeToggleFermenterFromSignal(prevRts.active, curr.rts.currentCmd ?? 'none')

  /* Carry over current fermenter-is-active state from previous state */
  const rts = R.merge(curr.rts, {
    active: prevRts.active,
    status: prevRts.status === 'initializing' ? (prevRts.active ? 'running' : 'off') : prevRts.status,
    currentCmd: newCmd,
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
          currentCmd: 'none',
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
          (dev) =>
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
          currentCmd: 'none',
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
