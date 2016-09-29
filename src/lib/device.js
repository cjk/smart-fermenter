import {List} from 'immutable';
import InitialState from '../initialState';
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

function switchOffAllDevices() {
  devices.map(dev => switcher(dev, 'off').log());
}

function maybeSwitchDevices(deviceState) {
  devices.forEach((dev) => {
    const device = deviceState.get(dev);
    const {willSwitch, shouldSwitchTo} = device;

    if (willSwitch) {
      switcher(dev, shouldSwitchTo);
    }
  });
}

export default {switchOffAllDevices, maybeSwitchDevices};
