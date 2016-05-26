/* PENDING: This is mostly generic code, so heater- and humidifier-controller
   should be merged! */
import {addEmergency} from '../history';

const [heatUpperLimit, heatLowerLimit] = [33, 30];

function temperatureController(envStream) {
  return envStream.map(state => {
    const temperature = state.getIn(['env', 'temperature']);
    const isValid = state.getIn(['env', 'isValid']);

    /* If the reading can be trusted, this is an emergency! */
    if (temperature > (heatUpperLimit + 3) && isValid) {
      console.error(`[temp-controller] Emergency-state for temperature (${temperature}) detected!`);
      return addEmergency(state, {at: Date.now(), sensor: 'temperature', device: 'heater'});
    }

    if (temperature > heatUpperLimit) {
      // console.info('[temp-controller]: too hot - heater should NOT be running');
      return state.updateIn(['devices', 'heater', 'shouldSwitchTo'], _v => 'off');
    } else if (temperature < heatLowerLimit) {
      // console.info('[temp-controller]: too cold - heater should be running');
      return state.updateIn(['devices', 'heater', 'shouldSwitchTo'], _v => 'on');
    }
    return state;
  });
}

export default temperatureController;
