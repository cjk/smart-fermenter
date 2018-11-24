// @flow

import type { Observable } from 'kefir'

import * as R from 'ramda'
import { addEmergency } from '../history'

const deviceShouldSwitchTo = (name, onOff, state) => R.assocPath(['devices', name, 'shouldSwitchTo'], onOff, state)

function humidifierController(state$: Observable<Object>) {
  return state$.map(state => {
    const humidity = R.path(['env', 'humidity'], state)
    const isValid = R.path(['env', 'isValid'], state)
    const [humLowerLimit, humUpperLimit] = R.path(['rts', 'humidityLimits'], state)

    /* Add an emergency to emergency-history if needed */
    const newState =
      humidity > humUpperLimit + 3 && isValid
        ? R.assocPath(
            ['history', 'emergencies'],
            addEmergency(state, {
              at: Date.now(),
              sensor: 'humidity',
              device: 'humidifier',
              value: humidity,
            }),
            state
          )
        : state

    if (humidity > humUpperLimit) {
      // console.info('[hum-controller]: too humid - humidifier should NOT be running');
      return deviceShouldSwitchTo('humidifier', 'off', newState)
    } else if (humidity < humLowerLimit) {
      // console.info('[hum-controller]: too try - humidifier should be running');
      return deviceShouldSwitchTo('humidifier', 'on', newState)
    }
    return newState
  })
}

export default humidifierController
