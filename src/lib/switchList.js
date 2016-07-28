import {Seq} from 'immutable';

const switchList = {
  heater: {
    desc: 'Fermenter Closet heater',
    systemCode: '10011',
    unitCode: 2,
    transport: null
  },
  humidifier: {
    desc: 'Fermenter Closet humidifier',
    systemCode: '10011',
    unitCode: 3,
    transport: null
  }
};

export default new Seq(switchList);
