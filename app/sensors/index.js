//import tempHumStream from './tempHumidity';
import tempHumStream from './simulatedTempHumidity';

export default tempHumStream.map((state) => {
  return state.setIn(['env', 'createdAt'], Date.now());
}).map(state => {
  /* Only states with valid timestamp + sensor-readings are flagged as valid */
  if (state.getIn(['env', 'temperature']) === 0 ||
      state.getIn(['env', 'humidity']) === 0 ||
      state.getIn(['env', 'errors']) > 0 ||
      state.getIn(['env', 'isValid']) === false)
    return state.setIn(['env', 'isValid'], false);
  else
    return state.setIn(['env', 'isValid'], true);
});
