/* eslint max-len: "off" */

import { buildMessage } from './message';
import { List } from 'immutable';

function buildEmergencyNotifications(runtimeState) {
  const { hasEnvEmergency, hasDeviceMalfunction } = runtimeState;

  let emNots = new List();

  if (hasEnvEmergency) {
    emNots = emNots.push(
      buildMessage(
        'Environmental emergency detected in fermenter-closet: Please check temperature and humidity values!',
        'warning'
      )
    );
  }

  if (hasDeviceMalfunction) {
    emNots = emNots.push(
      buildMessage(
        'Device emergency detected in fermenter-closet, please check if heater and/or humidifier are working as expected or are in need of maintenance!',
        'warning'
      )
    );
  }

  return emNots;
}

export default buildEmergencyNotifications;
