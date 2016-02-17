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
import {switchOps} from '../history';
import {emergencies} from '../history';

/* Watchdogs */
import {emergencyHalt} from '../watchdogs';

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
  devices.map(dev => {
    delayedSwitch(dev, 'off').log();
  });
};

const maybeSwitchDevices = (state) => {
  devices.forEach(dev => {
    const device = state.getIn(['devices', dev]);
    const {willSwitch, shouldSwitchTo} = device;

    if (willSwitch)
      delayedSwitch(dev, shouldSwitchTo).onValue(() => {});
  });
};

const handleDevices = (envStream) => {

  return envStream
    .filter(state => state.getIn(['env', 'isValid']))
    .scan(makeSwitchingDecisions, initialState)
    /* Collects (switching-) history here: */
    .scan(switchOps)
    /* Collects (emergency-) history here: */
    .scan(emergencies)
    .onError(errState => {
      /* NOTE: Unused for now - no error-conditions are generated at this time! */

      /* We're losing device-state here, so switch off
         anything to be able to start from a clean slate */
      switchOffAllDevices();
      messenger.emit('WARNING: your fermenter-closet just signaled an error-state!');
    })
    .onEnd(finalState => {
      switchOffAllDevices();
      messenger.emit('WARNING: your fermenter-closet just shut itself down.\nAll devices have been switched off, but please double check this and take care any remaining content in the closet!');
    })
    /* Evaluate history and stop stream (before devices being switched) in case of emergencies */
    .takeWhile(emergencyHalt)
    /* Perform actual switches here - depending on current state and if we
       actually got this far in the stream */
    .onValue(maybeSwitchDevices)
    /* Make log prettier by providing readable timestamps */
    .map(state =>
      state.updateIn(['env', 'createdAt'], (v) => moment(v).format())
    )
    /* (DEBUG-) logger */
    .log('Logger')
    ;
};

export default handleDevices;
