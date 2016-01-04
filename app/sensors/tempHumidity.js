import sensorLib from 'node-dht-sensor';

const sensor = {
  initialize: function () {
    return sensorLib.initialize(22, 4);
  },
  read: function () {
    let readout = sensorLib.read();
    console.log('Temperature: ' + readout.temperature.toFixed(2) + 'C, ' +
                'humidity: ' + readout.humidity.toFixed(2) + '%');
    setTimeout(function () {
      sensor.read();
    }, 5000);
  }
};

export default sensor;
