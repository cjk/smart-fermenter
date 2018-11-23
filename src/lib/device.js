// @flow

import type { Devices } from '../types'

import * as R from 'ramda'
import { devices } from '../initialState'
/* For switching */
import relaisSwitch from './relais/relaisSwitch'

const switchImpl =
  process.env.NODE_ENV === 'development' ? require('./simulatedSwitch').simulatedSwitch : require('rpio')

/* What switching implementation shall we use? Simulated or real: */
const switcher = relaisSwitch(switchImpl)

// dynamic version of: new List.of('heater', 'humidifier');
const deviceNames = R.keys(devices)

function switchOffAllDevices() {
  R.map(dev => switcher(dev, 'off').log(), deviceNames)
}

function maybeSwitchDevices(devices: Devices) {
  R.map(dev => {
    const { willSwitch, shouldSwitchTo } = dev

    if (willSwitch) {
      switcher(dev, shouldSwitchTo)
    }
  }, devices)
}

export { switchOffAllDevices, maybeSwitchDevices }
