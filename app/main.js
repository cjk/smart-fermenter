import controlEnvironment from './controller';
import handleDevices from './actors';
import createClient from './client';
import envStream from './sensors';

const runtimeStream = createClient(controlEnvironment(envStream));

const stateStream = handleDevices(runtimeStream);
stateStream.log();/* DEBUGGING only */

console.log('----------------------------------------------------------------------');
