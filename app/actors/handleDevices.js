import {maybeSwitchDevices, switchOffAllDevices} from '../lib/device';
import InitialState from '../initialState';

import notify from '../notifications';
import {prettifyTimestamp} from '../lib/datetime';

import makeSwitchingDecisions from '../controller/switchingController';
/* History */
import {switchOps, carryoverEmergencies} from '../history';
/* Watchdogs */
import {detectEnvEmergency, deviceRunningTooLong} from '../watchdogs';
/* Messaging + notifications */
import handleEmergencyNotifications from './messenger';
/* Logging */
import logState from '../stateLogger';

/* To send notifications */
const messenger = notify();

const readableTimestamps = state =>
  state.updateIn(['env', 'createdAt'],
                 /* We *may* receive an invalid date here before streams are
                 properly initialized, so check for it as 'moment' otherwise
                 spills a warning */
                 (v) => prettifyTimestamp(v)
  );

/* Filter out devices from whole state */
const switchDevices = (state) => maybeSwitchDevices(state.get('devices'));

const handleDevices = (envStream) => {
  return envStream
    /* Don't do anything when environment-readings are invalid */
    .filter(state => state.getIn(['env', 'isValid']))
    /* Decide whether devices should be switched or not */
    .scan(makeSwitchingDecisions, InitialState)
    /* Collects (switching-) history here: */
    .scan(switchOps)
    /* Collects (emergency-) history here: */
    .scan(carryoverEmergencies)
    /* Evaluate emergency-history and set an active environmental emergency
       under certain conditions */
    .scan(detectEnvEmergency)
    /* ... also signal malfunctioning devices, if any device exceeds running
       over a period of time */
    .scan(deviceRunningTooLong)
    .onValue(handleEmergencyNotifications)
    /* Perform actual switches here - depending on current state and if we
       actually got this far in the stream */
    .onValue(switchDevices)
    .onEnd(() => {
      switchOffAllDevices();
      messenger.emit('NOTE: your fermenter-closet just shut itself down cleanly.\nAll devices have been switched off, but please double check this and take care any remaining content in the closet!');
    })
    .onError(() => {
      /* NOTE: Unused for now - no error-conditions are generated at this time! */

      /* We're losing device-state here, so switch off
         anything to be able to start from a clean slate */
      switchOffAllDevices();
      messenger.emit('WARNING: your fermenter-closet just signaled an error-state!');
    })
    /* Terse log current state */
    .onValue(logState)
    /* Make log prettier by providing readable timestamps; DEPRECATED: use
       #logState above */
    .map(readableTimestamps)
    /* (DEBUG-) logger */
    /*     .log('Logger') */
    ;
};

export default handleDevices;
