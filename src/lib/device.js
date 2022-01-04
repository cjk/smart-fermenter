// @flow

import type { Devices } from '../types.js'
import type { RpioSwitchLib } from './relais/types.js'

import * as R from 'ramda'
import { devices } from '../initialState.js'
import rpio from 'rpio'
/* For switching */
import relaisSwitch from './relais/relaisSwitch.js'

type SwitchRelais = (string, string) => void

const switchImpl: RpioSwitchLib = rpio

/* PENDING: We used to distinguish between 'real' and simulated (e.g. on non-Raspi-hardware) switching, but since rpio
 * supports mocking in the meantime, this is unneeded complexity */
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
