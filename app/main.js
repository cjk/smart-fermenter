/* import config from './config'; */

import tempHumStream from './sensors/tempHumidity';
import server from './server';

/* const {busEvents, busState} = createBusStreams(); */

/* Setup and configure (websocket-/http-) server and pass event-emitters along
   for use in plugins et. al. */
/* server({conf: config.server, busEmitter: busEvents, busState: busState});
   console.log('Server initialized and ready to run.'); */

const throttledStream = tempHumStream.throttle(10000);
server(throttledStream);

/* Debugging to console */
throttledStream
  .onValue((readout) => {
    console.log('Temperature: ' + readout.temperature + 'C, ' +
                'humidity: ' + readout.humidity + '%');
  })
  .onError(error => {
    console.warn(error);
  });
