import Kefir from 'kefir';
import state, {Env} from '../initialState';

const interval = 1500;

const env = new Env({
  temperature: 23.0,
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
      return Kefir.interval(interval, initialState.setIn(['env', 'temperature'], 40)).take(1).toProperty();
    case 2:
      return Kefir.interval(interval, initialState.setIn(['env', 'temperature'], 23)).take(1).toProperty();
    case 3:
      return Kefir.interval(interval, initialState.setIn(['env', 'temperature'], 22)).take(1).toProperty();
    case 6:
      return Kefir.interval(interval, initialState.setIn(['env', 'temperature'], 27)).take(1).toProperty();
    case 8:
      return Kefir.interval(interval, initialState.setIn(['env', 'temperature'], 35)).take(1).toProperty();

    case 10:
      console.log('##### ENDING TEST');
      return false;

    default:
      return Kefir.interval(interval, initialState).take(1).toProperty();
  }
  return false;
});

export default simulatedTempHumStream;
