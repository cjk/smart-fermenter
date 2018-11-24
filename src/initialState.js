// @flow

import type { Env, FermenterState, Devices, RunTimeState, SwitchOp, Emergency, History } from './types'

const env: Env = {
  temperature: 20,
  humidity: 50,
  createdAt: Date.now(),
  errors: 0,
  emergency: false,
  isValid: true,
  iterations: 0,
}

const devices: Devices = {
  heater: {
    isOn: false,
    shouldSwitchTo: null,
    willSwitch: false,
    lastSwitchAt: null,
  },
  humidifier: {
    isOn: false,
    shouldSwitchTo: null,
    willSwitch: false,
    lastSwitchAt: null,
  },
}

const rts: RunTimeState = {
  active: false,
  status: 'initializing',
  hasEnvEmergency: false,
  hasDeviceMalfunction: false,
  currentCmd: null,
  tempLimits: [29, 31],
  humidityLimits: [62, 68],
  notifications: {},
}

const history: History = {
  switchOps: [],
  emergencies: [],
}

const initialState: FermenterState = {
  env,
  devices,
  history,
  rts,
}

const switchOp: SwitchOp = {
  device: '',
  to: null,
  at: undefined,
}

const emergency: Emergency = {
  device: null,
  sensor: null,
  at: undefined,
  value: undefined,
}

export { env, devices, history, switchOp, emergency }
export default initialState
