/* import config from './config';
   import server from './server'; */

import tempHumStream from './sensors/tempHumidity';

/* const {busEvents, busState} = createBusStreams(); */

/* Setup and configure (websocket-/http-) server and pass event-emitters along
   for use in plugins et. al. */
/* server({conf: config.server, busEmitter: busEvents, busState: busState});
   console.log('Server initialized and ready to run.'); */

tempHumStream
  .onValue((readout) => {
    console.log('Temperature: ' + readout.temperature.toFixed(2) + 'C, ' +
                'humidity: ' + readout.humidity.toFixed(2) + '%');
  })
  .onError(error => {
    console.warn(error);
  });
