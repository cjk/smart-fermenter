import Kefir from 'kefir';
import sensorLib from 'node-dht-sensor';
import State from '../InitialState';

const sensor = {
  initialize: () => {
    return sensorLib.initialize(22, 4);
  },
  read: () => {
    return sensorLib.read();
  }
};

function readSensor() {
  const env = sensor.read();

  return new State()
    .updateIn(['env', 'temperature'], temp => env.temperature.toFixed(1))
    .updateIn(['env', 'humidity'], hum => env.humidity.toFixed(1));
}

const sensorStream = sensor.initialize() ?
                     (
                       Kefir.
                             fromPoll(2000, readSensor).
                             toProperty()
                     ) :
                     Kefir.constantError('Failed to initialize temp-/humidity-sensor.');

export default sensorStream;
