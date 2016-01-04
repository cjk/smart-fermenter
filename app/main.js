/* import config from './config';
   import server from './server'; */

import tempHumSensor from './sensors/tempHumidity'

/* const {busEvents, busState} = createBusStreams(); */

/* Setup and configure (websocket-/http-) server and pass event-emitters along
   for use in plugins et. al. */
/* server({conf: config.server, busEmitter: busEvents, busState: busState});
   console.log('Server initialized and ready to run.'); */

if (tempHumSensor.initialize()) {
  tempHumSensor.read();
} else {
  console.warn('Failed to initialize sensor');
}
