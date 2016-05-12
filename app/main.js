import controlEnvironment from './controller';
import handleDevices from './actors';
import createClient from './client';
import envStream from './sensors';

const stateStream = createClient(controlEnvironment(envStream));

handleDevices(stateStream);

console.log('----------------------------------------------------------------------');
