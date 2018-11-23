// @flow
import type { Observable } from 'kefir'

import * as R from 'ramda'
import { addEmergency } from '../history'
import logger from 'debug'

const error = logger('smt:fermenter:tempControl')

// Hysteresis - prevents temperature to overshoot upper-limit by reducing upper-limit by 1%
const padUpperLimit = limit => limit - (1 / 100) * limit

const deviceShouldSwitchTo = (name, onOff, state) => R.assocPath(['devices', name, 'shouldSwitchTo'], onOff, state)

function temperatureController(state$: Observable<Object>) {
  return state$.map(state => {
    const temperature = R.path(['env', 'temperature'], state)
    const isValid = R.path(['env', 'isValid'], state)
    const [tempLowerLimit, tempUpperLimit] = R.path(['rts', 'tempLimits'], state)

    /* If the reading can be trusted, this is an emergency! */
    if (temperature > tempUpperLimit + 3 && isValid) {
      error(`Emergency-state for temperature (${temperature}) detected!`)
      addEmergency(state, {
        at: Date.now(),
        sensor: 'temperature',
        device: 'heater',
      })
    }

    if (temperature >= padUpperLimit(tempUpperLimit)) {
      // console.info('[temp-controller]: too hot - heater should NOT be running');
      return deviceShouldSwitchTo('heater', 'off', state)
    } else if (temperature < tempLowerLimit) {
      // console.info('[temp-controller]: too cold - heater should be running');
      return deviceShouldSwitchTo('heater', 'on', state)
    }
    return state
  })
}

export default temperatureController
