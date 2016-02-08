/* PENDING: This is mostly generic code, so heater- and humidifier-controller should be merged! */

const [humUpperLimit, humLowerLimit] = [56, 50];

function humidifierController(envStream) {
  return envStream.map(state => {
    const humidity = state.getIn(['env', 'humidity']);

    /* This is an emergency! */
    if (humidity > (humUpperLimit + 5)) {
      console.log(`!!!! Emergency-state for humidity (${humidity}) detected !!!!`);
      return state.setIn(['env', 'emergency'], true);
    }

    if (humidity > humUpperLimit) {
      console.log('[hum-controller]: too humid - humidifier should NOT be running');
      return state.updateIn(['devices', 'humidifier', 'shouldSwitchTo'], v => 'off');

    } else if (humidity < humLowerLimit) {
      console.log('[hum-controller]: too try - humidifier should be running');
      return state.updateIn(['devices', 'humidifier', 'shouldSwitchTo'], v => 'on');
    }

    return state;
  });
}

export default humidifierController;
