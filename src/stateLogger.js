// @flow
/* eslint no-console: "off", max-len: "off" */

import type { FermenterState } from './types'

import * as R from 'ramda'
import { prettifyTimestamp } from './lib/datetime'

function logState(state: FermenterState) {
  const { rts } = state
  const env = key => R.path(['env', key], state)
  const heater = key => R.path(['devices', 'heater', key], state)
  const humidifier = key => R.path(['devices', 'humidifier', key], state)

  const groupedSwitchOps = R.groupBy(s => s.device, R.path(['history', 'switchOps'], state))
  const switchOps = R.reduce(
    (acc, dev) => R.assoc(dev, R.length(groupedSwitchOps[dev]), acc),
    {},
    R.keys(groupedSwitchOps)
  )

  /* TODO: re-add after refactoring emergencies!
  // const emergencies = state
  //   .getIn(['history', 'emergencies'])
  //   .groupBy(v => v.device)
  //   .reduce((ems, dev, name) => ems.set(name, dev.size), new Map());

  // const hasEnvEmergency = rts.hasEnvEmergency ? '!' : '#';

  /* TODO: Malfunctioning devices (i.e. running too long) not yet being logged */
  //   const hasDeviceMalfunction = rts.hasDeviceMalfunction ? '!' : '#';

  const ts = prettifyTimestamp(R.path(['env', 'createdAt'], state))
  const log = {
    count: env('iterations'),
    ts,
    rts,
    temp: env('temperature'),
    hum: env('humidity'),
    heaterIsOn: heater('isOn'),
    heaterShouldSwitch: heater('shouldSwitchTo'),
    heaterWillSwitch: heater('willSwitch'),
    humidifierIsOn: humidifier('isOn'),
    humidifierShouldSwitch: humidifier('shouldSwitchTo'),
    humidifierWillSwitch: humidifier('willSwitch'),
    // heaterEmergencies: emergencies.get('heater'),
    // humidifierEmergencies: emergencies.get('humidifier'),
  }

  console.log(
    `${rts.active ? '=' : '-'}> #${log.count} ${log.ts} \
[${log.rts.status}] \
temp/hum: [${log.temp}/${log.hum}] \
heater: [${log.heaterIsOn}|${log.heaterShouldSwitch}|${log.heaterWillSwitch}] \
humidifier: [${log.humidifierIsOn}|${log.humidifierShouldSwitch}|${log.humidifierWillSwitch}] \
switchOps: #${JSON.stringify(switchOps)} \
Emergencies: [TODO] \
 <--${log.rts.currentCmd}`
  )
  // TODO: emergencies where previously logged like this:
  // Emergencies: ${hasEnvEmergency}${log.heaterEmergencies || 0}|${log.humidifierEmergencies || 0} \
}

export default logState
