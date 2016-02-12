import {List, Map} from 'immutable';
import initialState from '../initialState';
import Kefir from 'kefir';
import notify from '../notifications';

/* For switching */
import switchImpl from './simulatedSwitch';
import remoteSwitch from './remoteSwitch';

const messenger = notify();
const switcher = remoteSwitch(switchImpl);

const devices = List.of('heater', 'humidifier');

const shouldSwitchPath = (dev) => [dev, 'shouldSwitchTo'];
const isOnPath = (dev) => [dev, 'isOn'];

const switchByDevice = (prev, curr) =>  {

  const next = devices.reduce((next, dev) => {
    /* TODO Apply destructuring */
    const lastIsOn = prev.getIn(isOnPath(dev));

    /* Avoids switching non-running devices off and running devices on several times */
    const deviceAlreadyOnOff = (dev, shouldSwitchTo) => {
      const isOn = prev.getIn(isOnPath(dev));
      return (isOn && shouldSwitchTo === 'off') || (!isOn && shouldSwitchTo === 'on');
    };

    const lastShouldSwitch = prev.getIn(shouldSwitchPath(dev));
    const shouldSwitch = curr.getIn(shouldSwitchPath(dev));
    /* Decide whether we actually need to switch a device on or off */
    const isSwitching = shouldSwitch && (lastShouldSwitch !== shouldSwitch) && deviceAlreadyOnOff(dev, shouldSwitch);

    if (isSwitching) {
      console.log(`>>> We *switch* ${dev} ${shouldSwitch}!`);
      return next.mergeIn([dev], curr.setIn([dev, 'isOn'], shouldSwitch === 'on' ? true : false)
                                     .setIn([dev, 'isSwitching'], true)
                                     .get(dev));
    } else {
      console.log(`Not switching ${dev}`);
      return next.mergeIn([dev], curr.setIn([dev, 'isSwitching'], false)
                                     .setIn([dev, 'isOn'], lastIsOn)
                                     .get(dev));
    }
  }, Map());

  /* DEBUGGING */
  console.log('>>> next state:', next);

  return next;
};

const needsSwitching = (state) => state.some(dev => dev.get('isSwitching'));

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

  return envStream.filter(state => state.getIn(['env', 'isValid']))
                  .map(state => state.get('devices'))
                  .scan(switchByDevice, initialState.get('devices'))
                  .filter(needsSwitching)
                  .onError(errState => {
                    /* TODO: Currently nothing is triggering an error on this stream! */
                    console.log('!!! [devicehandler]: Sending error notification !!!');
                    //sendMessage.emit('Warning: your fermenter-closet just signaled an error-state!');

                    /* We're losing device-state here, so switch off
                       anything to be able to start from a clean slate */
                    switchOffAllDevices();
                  })
                  .onEnd(finalState => {
                    switchOffAllDevices();

                    messenger.emit('NOTE: your fermenter-closet shut itself down. All devices have been switched off, but please double check and take care of the food in the closet!');
                  })
                  .onValue(devState => {
                    /* TODO: Refactor: */
                    devices.forEach(dev => {
                      if (devState.getIn([dev, 'isSwitching']))
                        delayedSwitch(dev, devState.getIn(shouldSwitchPath(dev))).onValue(() => {});
                    });
                  });
};

export default handleDevices;
