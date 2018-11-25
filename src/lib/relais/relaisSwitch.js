/* @flow */
import type { RelaisSwitch, RpioSwitchLib } from './types'

import * as R from 'ramda'

const switches: RelaisSwitch = {
  heater: {
    desc: 'Fermenter Closet heater',
    pin: 3 /* GPIO-PIN - see https://github.com/kvalle/rpi-gpio-fun/blob/master/gpio-cheat-sheet.md */,
    transport: 'relais',
  },
  humidifier: {
    desc: 'Fermenter Closet humidifier',
    pin: 5 /* GPIO-PIN - see https://github.com/kvalle/rpi-gpio-fun/blob/master/gpio-cheat-sheet.md */,
    transport: 'relais',
  },
}

const prepareSwitch = switchLib =>
  R.map(sw => {
    console.log(`[Controller] Opening GPIO-output for <${sw.desc}> on pin <${sw.pin}> and pull-up to HIGH:`)
    return switchLib.open(sw.pin, switchLib.OUTPUT, switchLib.HIGH)
  }, switches)

const setupCleanupHandler = switchLib => {
  process.on('SIGINT', () => {
    console.log('Received SIGINT. Cleaning up and exiting...')
    R.map(sw => switchLib.close(sw.pin), switches)
    process.exit()
  })
}

function relaisSwitch(switchLib: RpioSwitchLib): (string, string) => void {
  /* Must configure GPIO-pins *before* any switching is done */
  prepareSwitch(switchLib)
  /* Also make sure we reset GPIOs on exit  */
  setupCleanupHandler(switchLib)

  return (switchName: string, state: string) => {
    const swtch = switches[switchName]

    const switchOn = sw => {
      console.log(`[Controller] About to switch ${sw.desc} on pin <${sw.pin}> ON:`)
      switchLib.write(sw.pin, switchLib.LOW)
    }

    const switchOff = sw => {
      console.log(`[Controller] About to switch ${sw.desc} on pin <${sw.pin}> OFF:`)
      switchLib.write(sw.pin, switchLib.HIGH)
    }

    if (state === 'on') {
      switchOn(swtch)
    } else {
      switchOff(swtch)
    }
  }
}

export default relaisSwitch
