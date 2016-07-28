import {List} from 'immutable';
import {getRandomInt} from './random';
import InitialState from '../initialState';
import K from 'kefir';
/* For switching */
import remoteSwitch from './remoteSwitch';

// @if NODE_ENV='development'
import switchImpl from './simulatedSwitch';
// @endif
// @if NODE_ENV='production'
import switchImpl from 'rcswitch'; /* eslint no-redeclare: "off" */
// @endif

/* What switching implementation shall we use? Simulated or real: */
const switcher = remoteSwitch(switchImpl);

// dynamic version of: new List.of('heater', 'humidifier');
const devices = new List(InitialState.get('devices').keys());

function delayedSwitch(dev, onOff) {
  const randomDelay = getRandomInt(10, 100);

  return K.fromCallback(callback => {
    setTimeout(() => {
      callback(1);
      switcher(dev, onOff);
    }, randomDelay);
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
