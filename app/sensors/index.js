//import tempHumStream from './tempHumidity';
import Kefir from 'kefir';
import tempHumStream from './simulatedTempHumidity';

const sanitizedTempHumStream = tempHumStream.map(state => {

  /* Only states with valid timestamp + sensor-readings are valid */
  if (state.temperature > 0 && state.humidity > 0)
    return state.set('isValid', true)
                .set('createdAt', Date.now());
  return state;
}).flatMap(state => state.errors > 0 ? Kefir.constantError(state.set('isValid', false).toJS()) : Kefir.constant(state));

export default sanitizedTempHumStream;
