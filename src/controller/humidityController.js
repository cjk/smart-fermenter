// @flow

import type { Observable } from 'kefir'

import * as R from 'ramda'
import { addEmergency } from '../history'
import logger from 'debug'

const error = logger('smt:fermenter:humControl')

const deviceShouldSwitchTo = (name, onOff, state) => R.assocPath(['devices', name, 'shouldSwitchTo'], onOff, state)

function humidifierController(state$: Observable<Object>) {
  return state$.map(state => {
    const humidity = R.path(['env', 'humidity'], state)
    const isValid = R.path(['env', 'isValid'], state)
    const [humLowerLimit, humUpperLimit] = R.path(['rts', 'humidityLimits'], state)

    /* If the reading can be trusted, this is an emergency! */
    if (humidity > humUpperLimit + 25 && isValid) {
      error(`Emergency-state for humidity (${humidity}) detected!`)
      addEmergency(state, {
        at: Date.now(),
        sensor: 'humidity',
        device: 'humidifier',
      })
    }

    if (humidity > humUpperLimit) {
      // console.info('[hum-controller]: too humid - humidifier should NOT be running');
      return deviceShouldSwitchTo('humidifier', 'off', state)
    } else if (humidity < humLowerLimit) {
      // console.info('[hum-controller]: too try - humidifier should be running');
      return deviceShouldSwitchTo('humidifier', 'on', state)
    }
    return state
  })
}

export default humidifierController
