// @flow

import type { FermenterState } from '../types'

import * as R from 'ramda'

function switchingController(prev: FermenterState, curr: FermenterState) {
  /* Do nothing if fermenter is off */
  if (!R.path(['rts', 'active'], curr)) {
    return curr
  }

  const deviceLens = dev => R.lensPath(['devices', dev])

  const newDeviceState = R.mapObjIndexed((dev, devName, _) => {
    const prevDev = R.view(deviceLens(devName), prev)
    const currDev = R.view(deviceLens(devName), curr)

    /* Return true only if a device should be switched on/off based on it's current and previous state. Avoids switching
     * non-running devices off and running devices on several times */
    return currDev.shouldSwitchTo &&
      ((prevDev.isOn && currDev.shouldSwitchTo === 'off') || (!prevDev.isOn && currDev.shouldSwitchTo === 'on'))
      ? R.merge(dev, { isOn: currDev.shouldSwitchTo === 'on', willSwitch: true, lastSwitchAt: Date.now() })
      : R.merge(dev, { isOn: prevDev.isOn, willSwitch: false, lastSwitchAt: prevDev.lastSwitchAt })
  }, R.prop('devices', curr))

  return R.assoc('devices', newDeviceState, curr)
}

export default switchingController
