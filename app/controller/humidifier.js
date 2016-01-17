import InitialState from '../fermenterState';
import remoteSwitch from '../actors';

const [humUpperLimit, humLowerLimit] = [65, 60];

const initialState = new InitialState;

const simulateSwitchesOnly = true;

function humidifierController(envStream) {
  return envStream.scan((prev, cur) => {
    /* Update previous state with new one, except for the humidifier-/humidifier state-values! */
    const state = prev.merge(cur, [['humidifierIsRunning', prev.humidifierIsRunning]]);

    if (state.humidity > humUpperLimit && prev.humidifierIsRunning) {
      console.log('Too humid, switch humidifier off!');
      simulateSwitchesOnly ? () => {} : remoteSwitch('humidifier', 'off');
      return state.set('humidifierIsRunning', false);

    } else if (state.humidity < humLowerLimit && !(prev.humidifierIsRunning)) {
      console.log('Too dry, switch humidifier on!');
      simulateSwitchesOnly ? () => {} : remoteSwitch('humidifier', 'on');
      return state.set('humidifierIsRunning', true);
    }

    return state;
  }, initialState);
}

export default humidifierController;
