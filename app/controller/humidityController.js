/* PENDING: This is mostly generic code, so heater- and humidifier-controller should be merged! */

const [humUpperLimit, humLowerLimit] = [56, 50];

function humidifierController(envStream) {
  return envStream.map(state => {
    const humidity = state.getIn(['env', 'humidity']);

    if (humidity > humUpperLimit) {
      console.log('[controller]: too humid - humidifier should NOT be running');
      return state.updateIn(['devices', 'humidifier', 'shouldBeRunning'], v => false);

    } else if (humidity > humLowerLimit) {
      console.log('[controller]: too try - humidifier should be running');
      return state.updateIn(['devices', 'humidifier', 'shouldBeRunning'], v => true);
    }
    return state;
  });
}

export default humidifierController;
