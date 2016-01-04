import sensorLib from 'node-dht-sensor';

const sensor = {
  initialize: function () {
    return sensorLib.initialize(22, 4);
  },
  read: function () {
    return sensorLib.read();
  }
};

export default sensor;
