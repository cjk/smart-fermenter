/* eslint no-console: "off" */

import controlEnvironment from './controller';
import handleDevices from './actors';
import createClient from './client';
import envStream from './sensors';

const {runtimeStream, start} = createClient(controlEnvironment(envStream));

const stateStream = handleDevices(runtimeStream);
// stateStream.log();/* DEBUGGING only */

console.log('----------------------------------------------------------------------');

start(stateStream);
