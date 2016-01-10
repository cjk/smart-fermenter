/* import config from './config'; */

import tempHumStream from './sensors/tempHumidity';
import server from './server';

const throttledStream = tempHumStream.throttle(10000);
server(throttledStream);

throttledStream
   .onValue((readout) => {
     console.log('Temperature: ' + readout.temperature + 'C, ' +
                 'humidity: ' + readout.humidity + '%');
   })
   .onError(error => {
     console.warn(error);
   });
