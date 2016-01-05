import Kefir from 'kefir';
import sensorLib from 'node-dht-sensor';

const sensor = {
  initialize: function () {
    return sensorLib.initialize(22, 4);
  },
  read: function () {
    return sensorLib.read();
  }
};

const sensorStream = sensor.initialize() ?
                     Kefir.fromPoll(2000, () => {
                       return sensor.read();
                     }) :
                     Kefir.constantError('Failed to initialize temp-/humidity-sensor.');

export default sensorStream;
