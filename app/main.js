/* import config from './config'; */

import server from './server';
import tempHumStream from './sensors/tempHumidity';

import remoteSwitch from './actors';
remoteSwitch('heater', 'off');

// const withState = tempHumStream.map((readout) => {
//   temp: readout.temperature,
//   hum: readout.humidity,
//   heaterIsRunning: false,
//   humidifierIsRunning: false
// });

const throttledStream = tempHumStream.throttle(10000);
server(throttledStream);

throttledStream
   .onValue((readout) => {
     console.log('Temperature: ' + readout.temperature + 'C, ' +
                 'humidity: ' + readout.humidity + '%');
   })
   .onError(error => {
     console.warn(error);
   })
  ;
