import {List} from 'immutable';
import initialState from '../initialState';
import Kefir from 'kefir';
import notify from '../notifications';

/* For switching */
import switchImpl from './simulatedSwitch';
import remoteSwitch from './remoteSwitch';
import maybeSwitchDevices from '../controller/switchController';
import recordSwitchingOps from '../controller/history';

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

const handleDevices = (envStream) => {

  return envStream
    .filter(state => state.getIn(['env', 'isValid']))
    .scan(maybeSwitchDevices, initialState)
    .log()
    .onError(errState => {
      /* TODO: Currently nothing is triggering an error on this stream! */
      messenger.emit('Warning: your fermenter-closet just signaled an error-state!');

      /* We're losing device-state here, so switch off
         anything to be able to start from a clean slate */
      switchOffAllDevices();
    })
    .onEnd(finalState => {
      switchOffAllDevices();

      messenger.emit('WARNING: your fermenter-closet just shut itself down.\nAll devices have been switched off, but please double check this and take care of the food in the closet!');
    })
    //.filter(needsSwitching)/* from here on we only get if at least one device must be switched on/off!! */
    .onValue(state => {
      devices.forEach(dev => {
        const device = state.getIn(['devices', dev]);
        const {willSwitch, shouldSwitchTo} = device;

        if (willSwitch)
          delayedSwitch(dev, shouldSwitchTo).onValue(() => {});
      });

    })
    /* Collects (switching-) history here: */
    .scan(recordSwitchingOps)
    /* Evaluate history here?! */
    .log()
    ;
};

export default handleDevices;
