/* eslint no-console: "off" */

import { pipe } from 'ramda';
import controlEnvironment from './controller';
import handleDevices from './actors';
import createClient from './client';
import state$ from './sensors';
import { setupCleanClientDisconnectHandler } from './lib/util';

const client = createClient();
// Cleanup client-connection on restarts or interrupts
setupCleanClientDisconnectHandler(client);

// stateStream.log();/* DEBUGGING only */

const workflow = pipe(
  client.mergeCommandStream,
  controlEnvironment,
  handleDevices,
  client.start
);

console.log(
  '----------------------------------------------------------------------'
);

workflow(state$);

// Send startup-completed signal to process-manager
if (process.send) process.send('ready');
