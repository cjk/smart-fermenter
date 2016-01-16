import fermenterController from './fermenterController';
import moment from 'moment';
import server from './server';
import tempHumStream from './sensors/tempHumidity';

/* Add current date to stream */
const fermenterEnvStream = tempHumStream.map(env => {
  env.createdAt = Date.now();
  return env;
});

const throttledFermenterEnvStream = fermenterEnvStream.throttle(6000, {trailing: false});

server(throttledFermenterEnvStream);

const actOnEnvStream = fermenterController(throttledFermenterEnvStream);

actOnEnvStream
   .onValue((readout) => {
     console.log(JSON.stringify(
       readout.set('createdAt', moment(readout.get('createdAt')).format()))
     );
   })
   .onError(error => {
     console.warn(error);
   })
