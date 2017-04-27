/* eslint no-console: "off", max-len: "off" */
import { Map } from 'immutable';
import { prettifyTimestamp } from './lib/datetime';

function logState(state) {
  const rts = state.get('rts');
  const env = key => state.getIn(['env'].concat(key));
  const heater = key => state.getIn(['devices', 'heater'].concat(key));
  const humidifier = key => state.getIn(['devices', 'humidifier'].concat(key));
  const switchOps = state
    .getIn(['history', 'switchOps'])
    .groupBy(v => v.device)
    .reduce((count, dev) => dev.size, 0);
  const emergencies = state
    .getIn(['history', 'emergencies'])
    .groupBy(v => v.device)
    .reduce((ems, dev, name) => ems.set(name, dev.size), new Map());
  const hasEnvEmergency = rts.hasEnvEmergency ? '!' : '#';
  /* TODO: Malfunctioning devices (i.e. running too long) not yet being logged */
  //   const hasDeviceMalfunction = rts.hasDeviceMalfunction ? '!' : '#';

  const ts = prettifyTimestamp(state.getIn(['env', 'createdAt']));
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
    heaterEmergencies: emergencies.get('heater'),
    humidifierEmergencies: emergencies.get('humidifier'),
  };

  console.log(
    `${rts.active ? '=' : '-'}> #${log.count} ${log.ts} \
[${log.rts.status}] \
temp/hum: [${log.temp}/${log.hum}] \
heater: [${log.heaterIsOn}|${log.heaterShouldSwitch}|${log.heaterWillSwitch}] \
humidifier: [${log.humidifierIsOn}|${log.humidifierShouldSwitch}|${log.humidifierWillSwitch}] \
switchOps: #${switchOps} \
Emergencies: ${hasEnvEmergency}${log.heaterEmergencies || 0}|${log.humidifierEmergencies || 0} \
 <--${log.rts.currentCmd}`
  );
}

export default logState;
