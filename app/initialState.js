import {Record, Map} from 'immutable';

const InitialState = Record({
  env: Map({
    createdAt: null,
    temperature: null,
    humidity: null,
    isValid: false,
    errors: 0,
  }),
  heater: Map({
    isOn: false,
    shouldBeRunning: false
  }),
  humidifier: Map({
    isOn: false,
    shouldBeRunning: false
  })
});

export default InitialState;
