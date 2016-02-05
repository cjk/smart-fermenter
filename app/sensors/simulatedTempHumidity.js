import Kefir from 'kefir';
import state, {Env} from '../initialState';

const interval = 1500;

const env = new Env({
  temperature: 20.0,
  humidity: 49.0,
  createdAt: Date.now(),
  isValid: true,
  errors: 0
});

const initialState = state.set('env', env);

//const simulatedTempHumStream = Kefir.interval(interval, initialState).toProperty();

  /*                      Kefir.constantError('Failed to initialize temp-/humidity-sensor.'); */

const simulatedTempHumStream = Kefir.repeat(n => {
  n += 1;

  console.log('### TEST-RUN #', n);
  switch (n) {
    case 1:
      return Kefir.interval(interval, initialState.setIn(['env', 'temperature'], 26)).take(1).toProperty();
    case 4:
      return Kefir.interval(interval, initialState.setIn(['env', 'temperature'], 40)).take(1).toProperty();

    case 8:
      console.log('##### ENDING TEST');
      return false;

    default:
      return Kefir.interval(interval, initialState).take(1).toProperty();
  }
  return false;
});

export default simulatedTempHumStream;
