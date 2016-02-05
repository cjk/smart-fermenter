import Kefir from 'kefir';
import initialState from '../initialState';

/* For switching */
import switchImpl from './simulatedSwitch';
import remoteSwitch from './remoteSwitch';

const switcher = remoteSwitch(switchImpl);

const shouldSwitchPath = ['heater', 'shouldSwitchTo'];

const handleDevices = (envStream) => {

  const diff = envStream.map(state => state.get('devices'))
                        .scan((prev, curr) => {
                          const lastShouldSwitch = prev.getIn(shouldSwitchPath);
                          const shouldSwitch = curr.getIn(shouldSwitchPath);

                          console.log('#### lastShouldSwitch: ' + lastShouldSwitch);
                          console.log('#### shouldSwitch: ' + shouldSwitch);
                          if (shouldSwitch && (lastShouldSwitch !== shouldSwitch)) {
                            console.log('>>> We should SWITCH!');
                            return curr.setIn(['heater', 'isOn'], shouldSwitch === 'on' ? true : false)
                                       .setIn(['heater', 'isSwitching'], true);
                          } else {
                            console.log('>>> No switch necessary!');
                            return curr.setIn(['heater', 'isSwitching'], false);
                          }
                        }, initialState.get('devices'))
                        .filter(state => state.getIn(['heater', 'isSwitching']));

  const doSwitch = (onOff) => Kefir.fromCallback(callback => {
    console.info('[## starting switch action ##]');
    setTimeout(() => {
      callback(1);
      switcher('heater', onOff);
    }, 100);
  });

  diff.onValue(devState => {
    console.log(devState);
    return doSwitch(devState.getIn(shouldSwitchPath)).log();
  });

};

export default handleDevices;
