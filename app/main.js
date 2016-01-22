import {heaterController, humidifierController} from './controller';
import Kefir from 'kefir';
import moment from 'moment';
import server from './server';
import tempHumStream from './sensors/tempHumidity';

/* Add current date to stream */
const fermenterEnvStream = tempHumStream.map(env => {
  env.createdAt = Date.now();
  return env;
});

const throttledFermenterEnvStream = fermenterEnvStream.throttle(6000, {trailing: false});
/* server(throttledFermenterEnvStream); */

const controlledTempStream = heaterController(throttledFermenterEnvStream);
const controlledHumidityStream = humidifierController(controlledTempStream);

/* const controlledEnvStream = Kefir.merge([controlledTempStream, controlledHumidityStream]); */

const controlledEnvStream = Kefir.combine([controlledTempStream, controlledHumidityStream], (heaterState, humidifierState) => heaterState.merge(humidifierState, [['humidifierIsRunning', humidifierState.humidifierIsRunning]]));

server(controlledEnvStream.throttle(8000, {trailing: false}));

// controlledHumidityStream
controlledEnvStream
  .onValue((fermenterState) => {
    console.log(JSON.stringify(
      fermenterState.set('createdAt', moment(fermenterState.get('createdAt')).format()))
    );
  })
  .onError(error => {
    console.warn(error);
  });
