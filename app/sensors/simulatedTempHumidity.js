import Kefir from 'kefir';
import state, {Env} from '../initialState';

const interval = 300;

const env = new Env({
  temperature: 26.0,
  humidity: 49.0,
  createdAt: Date.now(),
  errors: 0,
  emergency: false,
  isValid: true
});

const initialState = state.set('env', env);

//const simulatedTempHumStream = Kefir.interval(interval, initialState).toProperty();

  /*                      Kefir.constantError('Failed to initialize temp-/humidity-sensor.'); */

const simulatedTempHumStream = Kefir.repeat(n => {
  n += 1;

  console.log('### TEST-RUN #', n);
  switch (n) {
    case 1:
      return Kefir.interval(interval, initialState.setIn(['env', 'temperature'], 29)
                                                  .setIn(['env', 'humidity'], 30))
                  .take(1).toProperty();
    case 2:
      return Kefir.interval(interval, initialState.setIn(['env', 'temperature'], 23)).take(1).toProperty();
    case 3:
      return Kefir.interval(interval, initialState.setIn(['env', 'temperature'], 22)).take(1).toProperty();
    case 4:
      /* Cause a false alarm emergency */
      return Kefir.interval(interval, initialState.setIn(['env', 'temperature'], 99)
                                                  .setIn(['env', 'isValid'], true))
                  .take(2).toProperty();/* NOTE that currently three emergencies are needed to trigger halt, so this won't */
    case 6:
      return Kefir.interval(interval, initialState.setIn(['env', 'temperature'], 32.1)).take(1).toProperty();
    case 7:
      return Kefir.interval(interval, initialState.setIn(['env', 'temperature'], '0')
                                                  .setIn(['env', 'humidity'], '0'))
                  .take(1).toProperty();
    case 8:
      return Kefir.interval(interval, initialState.setIn(['env', 'humidity'], 65.1)).take(1).toProperty();
    case 9:
      return Kefir.interval(interval, initialState.setIn(['env', 'temperature'], 30)
                                                  .setIn(['env', 'humidity'], 57))
                  .take(1).toProperty();

    case 10:
      console.log('##### ENDING TEST ######');
      return false;

    default:
      return Kefir.interval(interval, initialState).take(1).toProperty();
  }
  return false;
});

export default simulatedTempHumStream;
