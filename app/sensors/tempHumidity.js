import Kefir from 'kefir';
import sensorLib from 'node-dht-sensor';
import fermenterState from '../fermenterState';

const sensor = {
  initialize: function () {
    return sensorLib.initialize(22, 4);
  },
  read: function () {
    return sensorLib.read();
  }
};

function readSensor() {
  const state = fermenterState(sensor.read());

  return state
    .set('temperature', state.temperature.toFixed(1))
    .set('humidity', state.humidity.toFixed(1))
    .toJS();
}

const sensorStream = sensor.initialize() ?
                     (
                       Kefir.
                             fromPoll(2000, readSensor).
                             toProperty(readSensor)
                     ) :
                     Kefir.constantError('Failed to initialize temp-/humidity-sensor.');

export default sensorStream;
