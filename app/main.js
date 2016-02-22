import controlEnvironment from './controller';
import handleDevices from './actors';
import server from './server';
import envStream from './sensors';

const fermenterEnvStream = controlEnvironment(envStream);

handleDevices(fermenterEnvStream);

server(fermenterEnvStream.throttle(4000, {trailing: false}));

console.log('----------------------------------------------------------------------');
