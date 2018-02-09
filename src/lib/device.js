import { List } from 'immutable';
import InitialState from '../initialState';
/* For switching */
import relaisSwitch from './relais/relaisSwitch';

const switchImplName =
  process.env.NODE_ENV === 'development' ? './simulatedSwitch' : 'rpio';

const switchImpl = require(switchImplName).default;

/* What switching implementation shall we use? Simulated or real: */
const switcher = relaisSwitch(switchImpl);

// dynamic version of: new List.of('heater', 'humidifier');
const devices = new List(InitialState.get('devices').keys());

function switchOffAllDevices() {
  devices.map(dev => switcher(dev, 'off').log());
}

function maybeSwitchDevices(deviceState) {
  devices.forEach(dev => {
    const device = deviceState.get(dev);
    const { willSwitch, shouldSwitchTo } = device;

    if (willSwitch) {
      switcher(dev, shouldSwitchTo);
    }
  });
}

export { switchOffAllDevices, maybeSwitchDevices };
