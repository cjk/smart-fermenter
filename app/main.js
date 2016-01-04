/* import config from './config';
   import server from './server'; */

import tempHumSensor from './sensors/tempHumidity';
import Kefir from 'kefir';

/* const {busEvents, busState} = createBusStreams(); */

/* Setup and configure (websocket-/http-) server and pass event-emitters along
   for use in plugins et. al. */
/* server({conf: config.server, busEmitter: busEvents, busState: busState});
   console.log('Server initialized and ready to run.'); */

if (tempHumSensor.initialize()) {
  const sensorStream = Kefir.fromPoll(2000, () => {
    return tempHumSensor.read();
  });

  sensorStream.onValue((readout) => {
    console.log('Temperature: ' + readout.temperature.toFixed(2) + 'C, ' +
                'humidity: ' + readout.humidity.toFixed(2) + '%');
  });

} else {
  console.warn('Failed to initialize sensor');
}
