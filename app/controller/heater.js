import InitialState from '../fermenterState';
import remoteSwitch from '../actors';

const [heatUpperLimit, heatLowerLimit] = [27, 25];

const initialState = new InitialState();

function heaterController(envStream) {
  return envStream.scan((prev, cur) => {

    if (!cur.isValid)
      return prev;

    /* Update previous state with new one, except for the heater-/humidifier state-values! */
    const state = prev.merge(cur, [['heaterIsRunning', prev.heaterIsRunning]]);

    if (state.temperature > heatUpperLimit && prev.heaterIsRunning) {
      console.log('Controller: Too hot, switch heater off!');
      remoteSwitch('heater', 'off');
      return state.set('heaterIsRunning', false);

    } else if (state.temperature < heatLowerLimit && !(prev.heaterIsRunning)) {
      console.log('Controller: Too cold, switch heater on!');
      remoteSwitch('heater', 'on');
      return state.set('heaterIsRunning', true);
    }

    return state;
  }, initialState);
}

export default heaterController;
