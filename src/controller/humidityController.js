/* PENDING: This is mostly generic code, so heater- and humidifier-controller
   should be merged! */
import { addEmergency } from '../history';

/* $FlowFixMe */
function humidifierController(state$) {
  return state$.map(state => {
    const humidity = state.getIn(['env', 'humidity']);
    const isValid = state.getIn(['env', 'isValid']);
    const [humLowerLimit, humUpperLimit] = state.getIn([
      'rts',
      'humidityLimits',
    ]);

    /* If the reading can be trusted, this is an emergency! */
    if (humidity > humUpperLimit + 25 && isValid) {
      console.error(
        `[hum-controller] Emergency-state for humidity (${humidity}) detected!`
      );
      addEmergency(state, {
        at: Date.now(),
        sensor: 'humidity',
        device: 'humidifier',
      });
    }

    if (humidity > humUpperLimit) {
      // console.info('[hum-controller]: too humid - humidifier should NOT be running');
      return state.updateIn(
        ['devices', 'humidifier', 'shouldSwitchTo'],
        _v => 'off'
      );
    } else if (humidity < humLowerLimit) {
      // console.info('[hum-controller]: too try - humidifier should be running');
      return state.updateIn(
        ['devices', 'humidifier', 'shouldSwitchTo'],
        _v => 'on'
      );
    }

    return state;
  });
}

export default humidifierController;
