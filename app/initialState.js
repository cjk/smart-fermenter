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

const History = Record({
  switchOps: null, /* Seq */
  emergencies: []
});

const InitialState = Map({
  env: new Env,
  devices: Map({
    heater: new Device(),
    humidifier: new Device()
  }),
  history: new History()
});

export {Env, Device, History, SwitchOp};
export default InitialState;
