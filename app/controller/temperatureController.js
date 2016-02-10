/* PENDING: This is mostly generic code, so heater- and humidifier-controller should be merged! */

const [heatUpperLimit, heatLowerLimit] = [32, 28];

function temperatureController(envStream) {
  return envStream.map(state => {
    const temperature = state.getIn(['env', 'temperature']);

    /* This is an emergency! */
    if (temperature > (heatUpperLimit + 5)) {
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
