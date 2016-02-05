import Kefir from 'kefir';

//import tempHumStream from './tempHumidity';
import tempHumStream from './simulatedTempHumidity';

const sanitizedTempHumStream = tempHumStream.map(state => {

  /* Only states with valid timestamp + sensor-readings are valid */
  if (state.getIn(['env', 'temperature']) > 0 &&
      state.getIn(['env', 'humidity']) > 0)
    return state.setIn(['env', 'isValid'], true)
                .setIn(['env', 'createdAt'], Date.now());
  return state;
}).flatMap(state => state.getIn(['env', 'errors']) > 0 ? Kefir.constantError(state.setIn(['env', 'isValid'], false).toJS()) : Kefir.constant(state));

export default sanitizedTempHumStream;
