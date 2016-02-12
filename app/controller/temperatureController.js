/* PENDING: This is mostly generic code, so heater- and humidifier-controller should be merged! */

const [heatUpperLimit, heatLowerLimit] = [31, 28];

function temperatureController(envStream) {
  return envStream.map(state => {
    const temperature = state.getIn(['env', 'temperature']),
          isValid = state.getIn(['env', 'isValid']);

    /* If the reading can be trusted, this is an emergency! */
    if (temperature > (heatUpperLimit + 5) && isValid) {
      console.log(`!!!! Emergency-state for temperature (${temperature}) detected !!!!`);
      return state.setIn(['env', 'emergency'], true);
    }

    if (temperature > heatUpperLimit) {
      console.log('[temp-controller]: too hot - heater should NOT be running');
      return state.updateIn(['devices', 'heater', 'shouldSwitchTo'], v => 'off');

    } else if (temperature < heatLowerLimit) {
      console.log('[temp-controller]: too cold - heater should be running');
      return state.updateIn(['devices', 'heater', 'shouldSwitchTo'], v => 'on');
    }
    return state;
  });
}

export default temperatureController;
