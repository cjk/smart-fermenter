/* @flow */

// NOTE: NOT USED YET - need to migrate from immutable to POJOs first!
// These definitions were originally taken from ./src/common/fermenter/types.js in SmartHomeApp-project

/* Fermenter related type definitions for Flow */
export type Env = {
  createdAt: number,
  temperature: ?number,
  humidity: ?number,
  isValid: boolean,
  errors: number,
  iterations: number,
};

export type Device = {
  isOn: boolean,
  shouldSwitchTo: ?string,
  willSwitch: boolean,
};

export type SwitchOp = {
  device: ?string,
  to: ?string,
  at: ?number,
};

export type Emergency = {
  device: ?string,
  sensor: ?string,
  at: ?number,
};

type Notification = {
  level: string,
  msg: ?string,
};

export type History = {
  switchOps: Array<SwitchOp>,
  emergencies: Array<Emergency>,
};

export type RunTimeState = {
  active: boolean,
  status: string,
  hasEnvEmergency: boolean,
  hasDeviceMalfunction: boolean,
  currentCmd: ?string,
  notifications: Array<Notification>,
};

type Devices = {
  heater: Device,
  humidifier: Device,
};

export type FermenterState = {
  rts: RunTimeState,
  env: Env,
  devices: Devices,
  history: History,
};
