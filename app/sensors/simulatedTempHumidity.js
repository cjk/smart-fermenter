import {Map} from 'immutable';
import Kefir from 'kefir';
import State from '../initialState';

const initialEnv = Map({
  temperature: 20.0,
  humidity: 49.0,
  createdAt: null,
  errors: 0
});

const initialState = new State().set('env', initialEnv);

const simulatedTempHumStream = Kefir.interval(2000, initialState).toProperty();
  /*                      Kefir.constantError('Failed to initialize temp-/humidity-sensor.'); */

export default simulatedTempHumStream;
