/* eslint no-console: "off" */

import { pipe } from 'ramda';
import controlEnvironment from './controller';
import handleDevices from './actors';
import createClient from './client';
import state$ from './sensors';

const client = createClient();

// stateStream.log();/* DEBUGGING only */

const workflow = pipe(client.mergeCommandStream, controlEnvironment, handleDevices, client.start);

console.log(
  '----------------------------------------------------------------------'
);

workflow(state$);
