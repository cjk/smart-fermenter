import {List} from 'immutable';
import initialState from '../initialState';
import Kefir from 'kefir';
import moment from 'moment';

import notify from '../notifications';
/* For switching */
import switchImpl from './simulatedSwitch';
import remoteSwitch from './remoteSwitch';
import makeSwitchingDecisions from '../controller/switchingController';
/* History */
import {switchOps, carryoverEmergencies} from '../history';
/* Watchdogs */
import {detectEnvEmergency, deviceRunningTooLong} from '../watchdogs';
/* Messaging + notifications */
import maybeSendNotifcations from './messenger';
/* Logging */
import logState from '../stateLogger';

/* To send notifications */
const messenger = notify();

/* What switching implementation shall we use? Simulated or real: */
const switcher = remoteSwitch(switchImpl);

const devices = List.of('heater', 'humidifier');

const delayedSwitch = (dev, onOff) => Kefir.fromCallback(callback => {
  setTimeout(() => {
    callback(1);
    switcher(dev, onOff);
  }, 100);
});

const switchOffAllDevices = () => {
  devices.map(dev => delayedSwitch(dev, 'off').log());
};

const maybeSwitchDevices = (state) => {
  devices.forEach(dev => {
    const device = state.getIn(['devices', dev]);
    const {willSwitch, shouldSwitchTo} = device;

    if (willSwitch) {
      delayedSwitch(dev, shouldSwitchTo).onValue(() => {});
    }
  });
};

const readableTimestamps = state =>
  state.updateIn(['env', 'createdAt'],
                 /* We *may* receive an invalid date here before streams are
                 properly initialized, so check for it as 'moment' otherwise
                 spills a warning */
                 (v) => (moment(v).isValid() ? moment(v).format() : undefined)
  );

const handleDevices = (envStream) => {
  return envStream
    /* Don't do anything when environment-readings are invalid */
    .filter(state => state.getIn(['env', 'isValid']))
    /* Decide whether devices should be switched or not */
    .scan(makeSwitchingDecisions, initialState)
    /* Collects (switching-) history here: */
    .scan(switchOps)
    /* Collects (emergency-) history here: */
    .scan(carryoverEmergencies)
    /* Evaluate emergency-history and set an active environmental emergency under certain conditions */
    .scan(detectEnvEmergency)
    /* ... also signal malfunctioning devices, if any device exceeds running over a period of time */
    .scan(deviceRunningTooLong)
    .onValue(maybeSendNotifcations)
    /* Perform actual switches here - depending on current state and if we
       actually got this far in the stream */
    .onValue(maybeSwitchDevices)
    .onEnd(finalState => {
      switchOffAllDevices();
      messenger.emit('NOTE: your fermenter-closet just shut itself down cleanly.\nAll devices have been switched off, but please double check this and take care any remaining content in the closet!');
    })
    .onError(errState => {
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
