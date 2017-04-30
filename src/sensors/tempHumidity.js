import K from 'kefir';
import sensorLib from 'node-dht-sensor';
import state from '../initialState';

const sensor = {
  initialize: () => sensorLib.initialize(22, 4),
  read: () => sensorLib.read(),
};

function readSensor() {
  const env = sensor.read();

  return (
    state /* Initial state's offspring! */
      /* PENDING: Possible dupe - move this conversion to our general validity-check
     in './index.js' ?! */
      .updateIn(['env', 'temperature'], _temp => env.temperature.toFixed(1))
      .updateIn(['env', 'humidity'], _hum => env.humidity.toFixed(1))
      .setIn(['env', 'isValid'], env.isValid)
      .setIn(['env', 'errors'], env.errors)
  );
}

const sensorStream = sensor.initialize()
  ? K.fromPoll(
      5000,
      readSensor
    ) /* emit a new sensor-reading every 10 seconds */.toProperty()
  : K.constantError('Failed to initialize temp-/humidity-sensor.');

export default sensorStream;
