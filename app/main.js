import controlEnvironment from './controller';
import handleDevices from './actors';
import server from './server';
import envStream from './sensors';

const handler = handleDevices(controlEnvironment(envStream));

server(handler.throttle(5000, {trailing: false}));

console.log('----------------------------------------------------------------------');
