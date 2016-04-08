/* eslint no-console: "off", max-len: "off" */

import {Map} from 'immutable';
import moment from 'moment';

function logState(state) {
  const env = key => state.getIn(['env'].concat(key));
  const heater = key => state.getIn(['devices', 'heater'].concat(key));
  const humidifier = key => state.getIn(['devices', 'humidifier'].concat(key));
  const switchOps = state.getIn(['history', 'switchOps'])
                         .groupBy(v => v.device)
                         .reduce((count, dev) => dev.size, 0);
  const emergencies = state.getIn(['history', 'emergencies'])
                           .groupBy(v => v.device)
                           .reduce((ems, dev, name) => (ems.has(name) ? ems.set(name, ems.get(name) + 1) : ems.set(name, 1)), new Map());

  const ts = moment(state.getIn(['env', 'createdAt'])).format();
  const log = {
    count: env('iterations'),
    ts,
    temp: env('temperature'),
    hum: env('humidity'),
    heaterIsOn: heater('isOn'),
    heaterShouldSwitch: heater('shouldSwitchTo'),
    heaterWillSwitch: heater('willSwitch'),
    humidifierIsOn: humidifier('isOn'),
    humidifierShouldSwitch: humidifier('shouldSwitchTo'),
    humidifierWillSwitch: humidifier('willSwitch'),
    heaterEmergencies: emergencies.get('heater'),
    humidifierEmergencies: emergencies.get('humidifier'),
  };

  console.log(`-> #${log.count} ${log.ts} \
temp/hum: [${log.temp}/${log.hum}] \
heater: [${log.heaterIsOn}|${log.heaterShouldSwitch}|${log.heaterWillSwitch}] \
humidifier: [${log.humidifierIsOn}|${log.humidifierShouldSwitch}|${log.humidifierWillSwitch}] \
switchOps: #${switchOps} \
Emergencies: #${log.heaterEmergencies || 0}|${log.humidifierEmergencies || 0} \
  `);
}

export default logState;
