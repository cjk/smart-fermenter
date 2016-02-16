import {Record, Map} from 'immutable';

const Env = Record({
  createdAt: null,
  temperature: null,
  humidity: null,
  isValid: false,
  errors: 0,
  emergency: false
});

const Device = Record({
  isOn: false,
  shouldSwitchTo: null,
  willSwitch: false
});

const SwitchOp = Record({
  device: '',
  to: null,
  at: undefined
});

const Emergency = Record({
  device: '',
  at: undefined
});

const History = Record({
  switchOps: null, /* Seq */
  emergencies: null /* Seq */
});

const InitialState = Map({
  env: new Env,
  devices: Map({
    heater: new Device(),
    humidifier: new Device()
  }),
  history: new History()
});

export {Env, Device, History, SwitchOp, Emergency};
export default InitialState;
