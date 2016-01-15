import fermenterController from './fermenterController';
import moment from 'moment';
import server from './server';
import tempHumStream from './sensors/tempHumidity';

const throttledStream = tempHumStream.throttle(6000);

/* Add current date to stream */
const fermenterEnvStream = throttledStream.map(env => {
  env.createdAt = Date.now();
  return env;
});

server(fermenterEnvStream);

const actOnEnvStream = fermenterController(fermenterEnvStream);

actOnEnvStream
   .onValue((readout) => {
     console.log(JSON.stringify(
       readout.set('createdAt', moment(readout.get('createdAt')).format()))
     );
   })
   .onError(error => {
     console.warn(error);
   })
