import {buildMessage} from './';
import {Seq} from 'immutable';

function buildEmergencyNotifications(runtimeState) {
  const {hasEnvEmergency, hasDeviceMalfunction} = runtimeState;

  let emNots = new Seq();

  if (hasEnvEmergency)
    emNots = emNots.push(buildMessage('warning', 'Environmental emergency detected in fermenter-closet: Please check temperature and humidity values!'));

  if (hasDeviceMalfunction)
    emNots = emNots.push('warning', 'Device emergency detected in fermenter-closet, please check if heater and/or humidifier are working as expected or are in need of maintenance!');

  return emNots;
}

export default buildEmergencyNotifications;
