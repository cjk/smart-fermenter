import {Seq} from 'immutable';

const switchList = {
  heater: {
    desc: 'Fermenter Closet heater',
    systemCode: '10011', /* identifier used for remote switching only  */
    unitCode: 2, /* used for remote switching only */
    pin: 2, /* GPIO-PIN - see https://github.com/kvalle/rpi-gpio-fun/blob/master/gpio-cheat-sheet.md */
    transport: null
  },
  humidifier: {
    desc: 'Fermenter Closet humidifier',
    systemCode: '10011', /* identifier used for remote switching only  */
    unitCode: 3, /* used for remote switching only */
    pin: 3, /* GPIO-PIN - see https://github.com/kvalle/rpi-gpio-fun/blob/master/gpio-cheat-sheet.md */
    transport: null
  }
};

export default new Seq(switchList);
