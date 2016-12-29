/* @flow */
import type RelaisSwitch from './types';

const switches: RelaisSwitch = {
  heater: {
    desc: 'Fermenter Closet heater',
    pin: 3, /* GPIO-PIN - see https://github.com/kvalle/rpi-gpio-fun/blob/master/gpio-cheat-sheet.md */
    transport: 'relais'
  },
  humidifier: {
    desc: 'Fermenter Closet humidifier',
    pin: 5, /* GPIO-PIN - see https://github.com/kvalle/rpi-gpio-fun/blob/master/gpio-cheat-sheet.md */
    transport: 'relais'
  }
};

function relaisSwitch(switchLib: any) {
  return (switchName: string, state: string) => {
    const swtch = switches[switchName];

    const prepareSwitch = (sw) => {
      switchLib.open(sw.pin, switchLib.OUTPUT, switchLib.HIGH);
    };

    const switchOn = (sw) => {
      console.log(`[Controller] About to switch ${sw.desc} on pin <${sw.pin}> ON:`);
      prepareSwitch(sw);
      switchLib.write(sw.pin, switchLib.LOW);
    };

    const switchOff = (sw) => {
      console.log(`[Controller] About to switch ${sw.desc} on pin <${sw.pin}> OFF:`);
      prepareSwitch(sw);
      switchLib.write(sw.pin, switchLib.HIGH);
    };

    if (state === 'on') {
      switchOn(swtch);
    } else {
      switchOff(swtch);
    }
  };
}

export default relaisSwitch;
