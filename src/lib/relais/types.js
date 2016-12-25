export type RelaisSwitch = {
  [name: string]: {
    desc: string,
    pin: number, /* GPIO-PIN - see https://github.com/kvalle/rpi-gpio-fun/blob/master/gpio-cheat-sheet.md */
    transport: string,
  },
};
