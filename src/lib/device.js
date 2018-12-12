// @flow

import type { Devices } from '../types'
import type { RpioSwitchLib } from './relais/types'

import * as R from 'ramda'
import { devices } from '../initialState'
/* For switching */
import relaisSwitch from './relais/relaisSwitch'

type SwitchRelais = (string, string) => void

const switchImpl: RpioSwitchLib =
  process.env.NODE_ENV === 'development' ? require('./simulatedSwitch').simulatedSwitch : require('rpio')

/* What switching implementation shall we use? Simulated or real: */
const switcher: SwitchRelais = relaisSwitch(switchImpl)

// dynamic version of: new List.of('heater', 'humidifier');
const deviceNames = R.keys(devices)

function switchOffAllDevices() {
  R.map(dev => switcher(dev, 'off').log(), deviceNames)
}

function maybeSwitchDevices(devices: Devices) {
  R.mapObjIndexed((dev, name) => {
    const { willSwitch, shouldSwitchTo } = dev

    if (willSwitch) {
      switcher(name, shouldSwitchTo)
    }
  }, devices)
}

export { switchOffAllDevices, maybeSwitchDevices }
