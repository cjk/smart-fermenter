import controlEnvironment from './controller';
import handleDevices from './actors';
import startClient from './client';
import envStream from './sensors';

const handler = handleDevices(controlEnvironment(envStream));

startClient(handler.throttle(5000, {trailing: false}));

console.log('----------------------------------------------------------------------');
