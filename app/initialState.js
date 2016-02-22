import {Record, Map, Seq} from 'immutable';

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
  willSwitch: false
});

const SwitchOp = Record({
  device: '',
  to: null,
  at: undefined
});

const Emergency = Record({
  device: null,
  sensor: null,
  at: undefined
});

const History = Record({
  switchOps: Seq(),
  emergencies: Seq()
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
