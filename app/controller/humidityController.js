/* PENDING: This is mostly generic code, so heater- and humidifier-controller should be merged! */

const [humUpperLimit, humLowerLimit] = [56, 50];

function humidifierController(envStream) {
  return envStream.map(state => {
    if (state.humidity > humUpperLimit) {
      console.log('Controller: Too humid, switch humidifier off!');
      return state.updateIn(['humidifier', 'shouldBeRunning'], v => true);

    } else if (state.humidity < humLowerLimit) {
      console.log('Controller: Too try, switch humidifier on!');
      return state.updateIn(['humidifier', 'shouldBeRunning'], v => true);
    }
    return state;
  });
}

export default humidifierController;
