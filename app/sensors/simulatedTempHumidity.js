import Kefir from 'kefir';
import FermenterState from '../fermenterState';

const simulatedTempHumStream = Kefir.interval(2000, new FermenterState({temperature: 20.0, humidity: 49.0, createdAt: null}));
  /*                      Kefir.constantError('Failed to initialize temp-/humidity-sensor.'); */

export default simulatedTempHumStream;
