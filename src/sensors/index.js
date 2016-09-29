// import tempHumStream from './tempHumidity';
import tempHumStream from './simulatedTempHumidity';

const isNumeric = n => !isNaN(parseFloat(n)) && isFinite(n);

export default tempHumStream.map((state) => {
  const env = state.get('env');
  const {temperature, humidity} = env;

  /* Add timestamp and convert possible string-numbers to native floats */
  return state.set('env', env.withMutations(map =>
    map.set('createdAt', Date.now())
       .set('temperature', Number.parseFloat(temperature))
       .set('humidity', Number.parseFloat(humidity))));
}).map((state) => {
  /* Perform a basic first validity-check */

  const {temperature, humidity, errors, isValid} = state.get('env');
  /* Only states with valid timestamp + sensor-readings are flagged as valid */
  if ((!isNumeric(temperature) || !isNumeric(humidity)) ||
      temperature === 0 ||
      humidity === 0 ||
      errors > 0 ||
      isValid === false) {
    return state.setIn(['env', 'isValid'], false);
  }
  return state.setIn(['env', 'isValid'], true);
});
