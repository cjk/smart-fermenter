import {List, Map} from 'immutable';
import initialState from '../initialState';
import Kefir from 'kefir';
import sendMessage from '../notifications';

/* For switching */
import switchImpl from './simulatedSwitch';
import remoteSwitch from './remoteSwitch';

const switcher = remoteSwitch(switchImpl);

const devices = List.of('heater', 'humidifier');

const shouldSwitchPath = (dev) => [dev, 'shouldSwitchTo'];
const isOnPath = (dev) => [dev, 'isOn'];

const compareForDevice = (prev, curr) =>  {
  const next = devices.reduce((next, dev) => {
    /* TODO Apply destructuring */
    const lastIsOn = prev.getIn(isOnPath(dev));

    /* Avoids switching non-running devices off and running devices on several times */
    const deviceAlreadyOnOff = (dev, shouldSwitchTo) => {
      const isOn = prev.getIn(isOnPath(dev));
      return (isOn && shouldSwitchTo === 'off') || (!isOn && shouldSwitchTo === 'on');
      /* For security-reasons, also allow otherwise nonsensical switching a device that is supposed to be off */
      //return (isOn && shouldSwitchTo === 'off') || (!isOn && shouldSwitchTo === 'on') || (isOn && shouldSwitchTo === 'off');
    };

    const lastShouldSwitch = prev.getIn(shouldSwitchPath(dev));
    const shouldSwitch = curr.getIn(shouldSwitchPath(dev));
    /* Decide whether we actually need to switch a device on or off */
    const isSwitching = shouldSwitch && (lastShouldSwitch !== shouldSwitch) && deviceAlreadyOnOff(dev, shouldSwitch);

    //console.log(`#### <${dev}> - setting lastIsOn to: ${lastIsOn}`);
    //console.log(`#### <${dev}> - lastShouldSwitch: ${lastShouldSwitch}`);
    //console.log(`#### <${dev}> - shouldSwitch: ${shouldSwitch}`);

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
  console.log('>>> next state:', next);
  return next;
};

const needsSwitching = (state) => state.some(dev => dev.get('isSwitching'));

const doSwitch = (dev, onOff) => Kefir.fromCallback(callback => {
  setTimeout(() => {
    callback(1);
    switcher(dev, onOff);
  }, 100);
});

const switchOffAllDevices = () => {
  devices.map(dev => {
    doSwitch(dev, 'off').log();
  });
};

const handleDevices = (envStream) => {

  const diff = envStream.map(state => state.get('devices'))
                        .scan(compareForDevice, initialState.get('devices'))
                        .filter(needsSwitching)
                        .onError(errState => {
                          console.log('!!! [devicehandler]: Sending error notification !!!');
                          /* TODO: Limit possible messages to 1 message/second! */
                          sendMessage('Warning: your fermenter-closet just signaled an error-state!');
                          /* TODO: Make use of this here?  */
                          //switchOffAllDevices();
                        })
                        .onEnd(finalState => sendMessage('NOTE: your fermenter-closet shut itself down!'));

  diff.onValue(devState => {
    devices.forEach(dev => {
      if (devState.getIn([dev, 'isSwitching']))
        doSwitch(dev, devState.getIn(shouldSwitchPath(dev)))
                  .onValue(() => {})
        ; //.log();
    });
  });

  return diff;
};

export default handleDevices;
