/* @flow */

/* Implementation for switching wireless outlets on/off, using a switch-lib like e.g. rcswitch.
 * NOTE: This implementation is deprecated and not used anymore (after switching to relays) - thus handle with care.
 * */
import type { RemoteSwitch, Transport } from './types'
import R from 'ramda'
import secureSwitching from './secureSwitching'

const swTransport: Transport = {
  type: 'radio-433mhz',
  pin: 16,
}

const switches: RemoteSwitch = {
  heater: {
    desc: 'Fermenter Closet heater',
    systemCode: '10011' /* identifier used for remote switching only  */,
    unitCode: 2 /* used for remote switching only */,
    transport: null,
  },
  humidifier: {
    desc: 'Fermenter Closet humidifier',
    systemCode: '10011' /* identifier used for remote switching only  */,
    unitCode: 3 /* used for remote switching only */,
    transport: null,
  },
}

function remoteSwitch(switchLib: any) {
  return (switchName: string, state: string) => {
    const swtch = R.assoc('transport', swTransport, switches.switchName)

    const prepareSwitch = sw => {
      switchLib.enableTransmit(sw.transport.pin)
    }

    const switchOn = sw => {
      // console.log(`[Controller] About to switch ${sw.desc} on <${sw.systemCode}#${sw.unitCode}> ON:`);
      prepareSwitch(sw)
      const switchFn = switchLib.switchOn.bind(switchLib, sw.systemCode, sw.unitCode)
      secureSwitching(switchFn)
    }

    const switchOff = sw => {
      // console.log(`[Controller]: About to switch ${sw.desc} on <${sw.systemCode}#${sw.unitCode}> OFF.`);
      prepareSwitch(sw)
      const switchFn = switchLib.switchOff.bind(switchLib, sw.systemCode, sw.unitCode)
      secureSwitching(switchFn)
    }

    if (state === 'on') {
      switchOn(swtch)
    } else {
      switchOff(swtch)
    }
  }
}

export default remoteSwitch
