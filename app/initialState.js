import {Record, Map} from 'immutable';

const Env = Record({
  createdAt: null,
  temperature: null,
  humidity: null,
  isValid: false,
  errors: 0,
});

const Device = Record({
  isOn: false,
  shouldSwitchTo: null,
  isSwitching: false
});

const InitialState = Map({
  env: new Env,
  devices: Map({
    heater: new Device(),
    humidifier: new Device()
  })
});

export {Env, Device};
export default InitialState;
