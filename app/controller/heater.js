import InitialState from '../fermenterState';
import remoteSwitch from '../actors';

const [heatUpperLimit, heatLowerLimit] = [30, 25];

const initialState = new InitialState;

const simulateSwitchesOnly = false;

function heaterController(envStream) {
  return envStream.scan((prev, cur) => {
    /* Update previous state with new one, except for the heater-/humidifier state-values! */
    const state = prev.merge(cur, [['heaterIsRunning', prev.heaterIsRunning]]);

    if (state.temperature > heatUpperLimit && prev.heaterIsRunning) {
      console.log('Too hot, switch heater off!');
      simulateSwitchesOnly ? () => {} : remoteSwitch('heater', 'off');
      return state.set('heaterIsRunning', false);

    } else if (state.temperature < heatLowerLimit && !(prev.heaterIsRunning)) {
      console.log('Too cold, switch heater on!');
      simulateSwitchesOnly ? () => {} : remoteSwitch('heater', 'on');
      return state.set('heaterIsRunning', true);
    }

    return state;
  }, initialState);
}

export default heaterController;
