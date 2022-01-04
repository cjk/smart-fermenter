// @flow
import type { Observable } from 'kefir'
import type { FermenterState } from '../types.js'

import * as R from 'ramda'
import { addEmergency } from '../history/index.js'

// Hysteresis - prevents temperature to overshoot upper-limit by reducing upper-limit by 1%
const padUpperLimit = limit => limit - (1 / 100) * limit

const deviceShouldSwitchTo = (name, onOff, state) => R.assocPath(['devices', name, 'shouldSwitchTo'], onOff, state)

function temperatureController(state$: Observable<Object>) {
  return state$.map((state: FermenterState) => {
    const temperature: number = R.path(['env', 'temperature'], state)
    const isValid: boolean = R.path(['env', 'isValid'], state)
    const {
      rts: {
        tempLimits: { lower: tempLowerLimit, upper: tempUpperLimit },
      },
    } = state

    /* Add an emergency to emergency-history if needed */
    const newState =
      temperature > tempUpperLimit + 3 && isValid
        ? R.assocPath(
            ['history', 'emergencies'],
            addEmergency(state, {
              at: Date.now(),
              sensor: 'temperature',
              device: 'heater',
              value: temperature,
            }),
            state
          )
        : state

    if (temperature >= padUpperLimit(tempUpperLimit)) {
      // console.info('[temp-controller]: too hot - heater should NOT be running');
      return deviceShouldSwitchTo('heater', 'off', newState)
    } else if (temperature < tempLowerLimit) {
      // console.info('[temp-controller]: too cold - heater should be running');
      return deviceShouldSwitchTo('heater', 'on', newState)
    }
    return newState
  })
}

export default temperatureController
