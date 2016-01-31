//import tempHumStream from './tempHumidity';
import tempHumStream from './simulatedTempHumidity';

const sanitizedTempHumStream = tempHumStream.map(state => {

  /* Only states with valid timestamp + sensor-readings are valid */
  if (state.temperature > 0 && state.humidity > 0)
    return state.set('isValid', true)
                .set('createdAt', Date.now());
  return state;
});

export default sanitizedTempHumStream;
