import controlEnvironment from './controller';
import handleDevices from './actors';
import handleWatchdogs from './watchdogs';
import server from './server';
import envStream from './sensors';

const fermenterEnvStream = controlEnvironment(envStream);

//handleDevices(handleWatchdogs(fermenterEnvStream));
handleDevices(fermenterEnvStream);

server(fermenterEnvStream.throttle(8000, {trailing: false}));

console.log('----------------------------------------------------------------------');
