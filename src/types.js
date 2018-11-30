/* @flow */
import type { Observable } from 'kefir'

// NOTE: NOT USED YET - need to migrate from immutable to POJOs first!
// These definitions were originally taken from ./src/common/fermenter/types.js in SmartHomeApp-project

/* Fermenter related type definitions for Flow */
export type Env = {
  createdAt: number,
  temperature: number,
  humidity: number,
  isValid: boolean,
  errors: number,
  iterations: number,
}

export type Device = {
  isOn: boolean,
  shouldSwitchTo: string,
  willSwitch: boolean,
  lastSwitchAt: ?number,
}

export type SwitchOp = {
  device: ?string,
  to: ?string,
  at: ?number,
}

export type Emergency = {
  device: string,
  sensor: string,
  at: number,
  value: number,
}

export type Notification = {
  level: string,
  msg: ?string,
}

export type Notifications = { [ts: number]: Notification }

export type History = {
  switchOps: Array<SwitchOp>,
  emergencies: Array<Emergency>,
}

export type RunTimeState = {
  active: boolean,
  status: string,
  hasEnvEmergency: boolean,
  hasDeviceMalfunction: boolean,
  currentCmd: ?string,
  tempLimits: { lower: number, upper: number },
  humidityLimits: { lower: number, upper: number },
  notifications: Notifications,
}

export type Devices = {
  heater: Device,
  humidifier: Device,
}

export type FermenterState = {
  rts: RunTimeState,
  env: Env,
  devices: Devices,
  history: History,
}

/* Derived Stream / Observable-types from Kefir */
export type FermenterState$ = Observable<FermenterState>
