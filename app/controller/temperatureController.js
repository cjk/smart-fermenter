/* PENDING: This is mostly generic code, so heater- and humidifier-controller should be merged! */

const [heatUpperLimit, heatLowerLimit] = [27, 25];

function temperatureController(envStream) {
  return envStream.map(state => {
    const temperature = state.getIn(['env', 'temperature']);

    if (temperature > heatUpperLimit) {
      console.log('[controller]: too hot - heater should NOT be running');
      return state.updateIn(['devices', 'heater', 'shouldBeRunning'], v => false);

    } else if (temperature < heatLowerLimit) {
      console.log('[controller]: too cold - heater should be running');
      return state.updateIn(['devices', 'heater', 'shouldBeRunning'], v => true);
    }
    return state;
  });
}

export default temperatureController;
