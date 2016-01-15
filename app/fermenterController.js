import InitialState from './fermenterState';
import remoteSwitch from './actors';

const [heatUpperLimit, heatLowerLimit] = [22, 20];
const [humUpperLimit, humLowerLimit] = [65, 38];

const initialState = new InitialState;

function fermenterController(envStream) {
  return envStream.scan((prev, cur) => {
    /* Update previous state with new one, except for the heater-/humidifier state-values! */
    const state = prev.merge(cur, [['heaterIsRunning', prev.heaterIsRunning]]);

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
  }, initialState);
}

export default fermenterController;
