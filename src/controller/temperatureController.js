// @flow
import { addEmergency } from '../history';
import logger from 'debug';

const error = logger('smt:fermenter:tempControl');

// Hysteresis - prevents temperature to overshoot upper-limit by reducing upper-limit by 1%
const padUpperLimit = limit => limit - 1 / 100 * limit;

/* $FlowFixMe */
function temperatureController(state$) {
  return state$.map(state => {
    const temperature = state.getIn(['env', 'temperature']);
    const isValid = state.getIn(['env', 'isValid']);
    const [tempLowerLimit, tempUpperLimit] = state.getIn(['rts', 'tempLimits']);

    /* If the reading can be trusted, this is an emergency! */
    if (temperature > tempUpperLimit + 3 && isValid) {
      error(`Emergency-state for temperature (${temperature}) detected!`);
      addEmergency(state, {
        at: Date.now(),
        sensor: 'temperature',
        device: 'heater',
      });
    }

    if (temperature >= padUpperLimit(tempUpperLimit)) {
      // console.info('[temp-controller]: too hot - heater should NOT be running');
      return state.updateIn(['devices', 'heater', 'shouldSwitchTo'], _v => 'off');
    } else if (temperature < tempLowerLimit) {
      // console.info('[temp-controller]: too cold - heater should be running');
      return state.updateIn(['devices', 'heater', 'shouldSwitchTo'], _v => 'on');
    }
    return state;
  });
}

export default temperatureController;
