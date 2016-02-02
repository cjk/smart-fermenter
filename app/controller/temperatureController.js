/* PENDING: This is mostly generic code, so heater- and humidifier-controller should be merged! */

const [heatUpperLimit, heatLowerLimit] = [27, 25];

function temperatureController(envStream) {
  return envStream.map(state => {
    if (state.getIn(['env', 'temperature']) > heatUpperLimit) {
      console.log('Controller: Too hot, switch heater off!');
      return state.updateIn(['heater', 'shouldBeRunning'], v => true);

    } else if (state.getIn(['env', 'temperature']) < heatLowerLimit) {
      console.log('Controller: Too cold, switch heater on!');
      return state.updateIn(['heater', 'shouldBeRunning'], v => true);
    }
    return state;
  });
}

export default temperatureController;
