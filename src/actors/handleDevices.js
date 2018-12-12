// @flow

import type { FermenterState$ } from '../types'

import * as R from 'ramda'

import { maybeSwitchDevices, switchOffAllDevices } from '../lib/device'
import initialState from '../initialState'

import makeSwitchingDecisions from '../controller/switchingController'

/* TODO: History */
import { switchOps, carryoverEmergencies } from '../history'

/* TODO: Watchdogs */
import { detectEnvEmergency, deviceRunningTooLong } from '../watchdogs'

/* Update global state (like switching-decisions) based on current / previous
   runtime state */
import bootstrapRuntimeState from './bootstrapRuntimeState'
/* Handle runtime-state, like emergencies, notifications, on/off */
import handleRuntimeSideEffects from './runtimeSideEffectHandler'
/* Logging */
import logState from '../stateLogger'

/* Filter out devices from state and pass them on for conditional switching */
const switchDevices = state => maybeSwitchDevices(state.devices)

/* Preliminary onEnd-callback */
const handleEndOfStream = () => {
  switchOffAllDevices()
  // messenger.emit('NOTE: your fermenter-closet just shut itself down cleanly.\nAll devices have been switched off, but please double check this and take care any remaining content in the closet!');
}

function handleDevices(state$: FermenterState$) {
  return (
    state$
      /* Don't do anything when environment-readings are invalid */
      .filter(state => R.path(['env', 'isValid'], state))
      /* Bootstraps runtime-state, like toggling fermenter active-state on/off.
       Thus, must occur *before* switching devices */
      .scan(bootstrapRuntimeState)
      /* Decide whether devices should be switched off/on based on environmental data */
      .scan(makeSwitchingDecisions, initialState)
      /* Collects (switching-) history here: */
      // TODO: refactor!
      // .scan(switchOps)
      /* Collects (emergency-) history here: */
      .scan(carryoverEmergencies)
      /* Evaluate emergency-history and set an active environmental emergency
       under certain conditions */
      .scan(detectEnvEmergency)
      /* also signal malfunctioning switches / devices, if any device exceeds running
       over a period of time */
      // PENDING: Re-enable this for increased security in case switching goes wrong!
      // This was disabled to prevent benign error-messages when no humidifier was actually connected.
      //     .scan(deviceRunningTooLong)
      /* Analyse runtime-state and carry out resulting side-effect, like sending
       notifications etc. */
      .onValue(handleRuntimeSideEffects)
      /* Perform actual switches here - depending on current state and if we
       actually got this far in the stream */
      .onValue(switchDevices)
      /* PENDING: As of now stream is never supposed to end so this is never executed */
      .onEnd(handleEndOfStream)
      /* Terse log current state */
      .onValue(logState)
  )
}

export default handleDevices
