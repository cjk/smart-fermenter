import notify from '../notifications';
/* To send notifications */
const messenger = notify();

function handleEmergencyNotifications(runtimeState) {
  const {hasEnvEmergency, hasDeviceMalfunction} = runtimeState;

  if (hasEnvEmergency)
    messenger.emit('Environmental emergency detected in fermenter-closet: Please check temperature and humidity values!');

  if (hasDeviceMalfunction)
    messenger.emit('Device emergency detected in fermenter-closet, please check if heater and/or humidifier are working as expected or are in need of maintenance!');
}

export default handleEmergencyNotifications;
