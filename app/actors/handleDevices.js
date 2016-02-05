import Kefir from 'kefir';
import initialState from '../initialState';

/* For switching */
import switchImpl from './simulatedSwitch';
import remoteSwitch from './remoteSwitch';

const switcher = remoteSwitch(switchImpl);

const handleDevices = (envStream) => {

  const diff = envStream.map(state => state.get('devices'))
                        .scan((prev, next) => {
                          const prevShouldRun = prev.getIn(['heater', 'shouldBeRunning']);
                          const nextShouldRun = next.getIn(['heater', 'shouldBeRunning']);
                          console.log(`PREV-NEXT: ${prevShouldRun} <-> ${nextShouldRun}`);

                          if (prevShouldRun !== nextShouldRun) {
                            //console.log('>>> We should SWITCH!');
                            return next.setIn(['heater', 'isSwitching'], true);
                          } else {
                            //console.log('>>> No switch necessary!');
                            return next.setIn(['heater', 'isSwitching'], false);
                          }
                        }, initialState.get('devices'))
                        .filter(state => state.getIn(['heater', 'isSwitching']));

  const doSwitch = (onOff) => Kefir.fromCallback(callback => {
    console.info('[starting switch action]');
    setTimeout(() => {
      callback(1);
      switcher('heater', onOff);
    }, 100);
  });

  diff.onValue(devState => {
    console.log(devState);
    return doSwitch(devState.getIn(['heater', 'shouldBeRunning']) ? 'on' : 'off').log();
  });

};

export default handleDevices;
