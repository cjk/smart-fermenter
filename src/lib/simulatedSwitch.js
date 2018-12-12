// @flow

/* Simple but useful (Relais- / remote-) switch simulator.
 * Use when developing / debugging / testing on non-ARM platforms or machines where you cannot use libraries operating
 * physical switches directly */

import signale from 'signale'

const simulatedSwitch = {
  open(pin: number, _type: number, _state) {
    /* NOOP here - used by rpio to prepare GPIO for output */
    signale.debug(`Mock preparing GPIO on PIN <${pin}>.`)
  },
  close(pin: number) {
    /* NOOP here - used by rpio to cleanup / reset a GPIO pin */
    signale.debug(`Mock closing GPIO on PIN <${pin}>.`)
  },
  write(pin: number, _state) {
    /* NOOP here - used by rpio to write to a GPIO */
    signale.debug(`Mock writing to GPIO on PIN <${pin}>.`)
  },
  enableTransmit(pin: number) {
    /* NOOP here - used by rcswitch to prepare GPIO for output */
    signale.debug(`Mock preparing GPIO on PIN <${pin}>.`)
  },
  switchOn(systemCode, unitCode) {
    /* NOOP here */
    signale.debug(`Mock switching <${systemCode}#${unitCode}> ON!`)
  },
  switchOff(systemCode, unitCode) {
    /* NOOP here */
    signale.debug(`Mock switching <${systemCode}#${unitCode}> OFF!`)
  },
}

export { simulatedSwitch }
