/* eslint no-console: "off" */

import controlEnvironment from './controller';
import handleDevices from './actors';
import createClient from './client';
import state$ from './sensors';

const client = createClient();

/* TODO: use Ramda's pipe here... */
const rtStream$ = client.mergeCommandStream(controlEnvironment(state$));

// stateStream.log();/* DEBUGGING only */

console.log(
  '----------------------------------------------------------------------'
);

client.start(handleDevices(rtStream$));
