import {heaterController, humidifierController} from './controller';
import moment from 'moment';
import Kefir from 'kefir';
import server from './server';

/* import tempHumStream from './sensors/tempHumidity'; */
import fermenterEnvStream from './sensors';

const controlledTempStream = heaterController(fermenterEnvStream);
const controlledHumidityStream = humidifierController(controlledTempStream);

/* const controlledEnvStream = Kefir.merge([controlledTempStream, controlledHumidityStream]); */

const controlledEnvStream = Kefir.combine([controlledTempStream, controlledHumidityStream], (heaterState, humidifierState) => heaterState.merge(humidifierState, [['humidifierIsRunning', humidifierState.humidifierIsRunning]]));

server(controlledEnvStream.throttle(8000, {trailing: false}));

controlledEnvStream
  .onValue((fermenterState) => {
    console.log(JSON.stringify(
      fermenterState.set('createdAt', moment(fermenterState.get('createdAt')).format()))
    );
  })
  .onError(error => {
    console.warn(error);
  });
