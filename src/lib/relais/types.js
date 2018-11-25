// @flow

export type RelaisSwitch = {
  [name: string]: {
    desc: string,
    pin: number /* GPIO-PIN - see https://github.com/kvalle/rpi-gpio-fun/blob/master/gpio-cheat-sheet.md */,
    transport: string,
  },
}

/* see https://github.com/jperkin/node-rpio/blob/master/lib/rpio.js */
export type RpioSwitchLib = {
  init: Function,
  open: Function,
  read: Function,
  write: Function,
  close: Function,
}
