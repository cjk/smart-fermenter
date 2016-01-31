import Kefir from 'kefir';
import sensorLib from 'node-dht-sensor';
import fermenterState from '../fermenterState';

const sensor = {
  initialize: () => {
    return sensorLib.initialize(22, 4);
  },
  read: () => {
    return sensorLib.read();
  }
};

function readSensor() {
  const state = fermenterState(sensor.read());

  return state
    .set('temperature', state.temperature.toFixed(1))
    .set('humidity', state.humidity.toFixed(1));
}

const sensorStream = sensor.initialize() ?
                     (
                       Kefir.
                             fromPoll(2000, readSensor).
                             toProperty()
                     ) :
                     Kefir.constantError('Failed to initialize temp-/humidity-sensor.');

export default sensorStream;
