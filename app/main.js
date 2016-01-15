import {Record} from 'immutable';
import remoteSwitch from './actors';
import server from './server';
import tempHumStream from './sensors/tempHumidity';

const InitialState = Record({
  createdAt: null,
  temperature: null,
  humidity: null,
  isValid: null,
  errors: 0,
  heaterIsRunning: false,
  humidifierIsRunning: false
});
const initialState = new InitialState;

const [heatUpperLimit, heatLowerLimit] = [22, 20];
const [humUpperLimit, humLowerLimit] = [65, 38];

remoteSwitch('heater', 'off');

const throttledStream = tempHumStream.throttle(6000);

/* For debugging only: */
/* let counter = 1; */

/* Add current date to stream */
const fermenterEnv = throttledStream.map(env => {
  env.createdAt = Date.now();
  /*   counter += 1; */
  /*   if (counter > 3) env.temperature = (Number.parseFloat(env.temperature) + 20).toFixed(1); */
  return env;
});

server(fermenterEnv);

const actOnTempHum = fermenterEnv.scan((prev, cur) => {
  const state = prev.merge(cur);

  if (state.temperature > heatUpperLimit && prev.heaterIsRunning) {
    console.log('Too hot, switch heater off!');
    remoteSwitch('heater', 'off');
    return state.set('heaterIsRunning', false);
  } else if (state.temperature < heatLowerLimit && !(prev.heaterIsRunning)) {
    console.log('Too cold, switch heater on!');
    remoteSwitch('heater', 'on');
    return state.set('heaterIsRunning', true);
  }

  return state;
}, initialState)

actOnTempHum
   .onValue((readout) => {
     console.log(JSON.stringify(readout));
   })
   .onError(error => {
     console.warn(error);
   })
  ;
