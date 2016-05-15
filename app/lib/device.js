import {List} from 'immutable';
import InitialState from '../initialState';
import K from 'kefir';
/* For switching */
import switchImpl from './simulatedSwitch';
import remoteSwitch from './remoteSwitch';

/* What switching implementation shall we use? Simulated or real: */
const switcher = remoteSwitch(switchImpl);

// dynamic version of: new List.of('heater', 'humidifier');
const devices = new List(InitialState.get('devices').keys());

function delayedSwitch(dev, onOff) {
  return K.fromCallback(callback => {
    setTimeout(() => {
      callback(1);
      switcher(dev, onOff);
    }, 100);
  });
}

function switchOffAllDevices() {
  devices.map(dev => delayedSwitch(dev, 'off').log());
}

function maybeSwitchDevices(deviceState) {
  devices.forEach(dev => {
    const device = deviceState.get(dev);
    const {willSwitch, shouldSwitchTo} = device;

    if (willSwitch) {
      delayedSwitch(dev, shouldSwitchTo).onValue(() => {});
    }
  });
}

export default {switchOffAllDevices, maybeSwitchDevices};
