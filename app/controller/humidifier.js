import InitialState from '../fermenterState';
import remoteSwitch from '../actors';

const [humUpperLimit, humLowerLimit] = [56, 50];

const initialState = new InitialState();

function humidifierController(envStream) {
  return envStream.scan((prev, cur) => {
    /* Update previous state with new one, except for the humidifier-/humidifier state-values! */
    const state = prev.merge(cur, [['humidifierIsRunning', prev.humidifierIsRunning]]);

    if (!state.isValid)
      return state;

    if (state.humidity > humUpperLimit && prev.humidifierIsRunning) {
      console.log('Controller: Too humid, switch humidifier off!');
      remoteSwitch('humidifier', 'off');
      return state.set('humidifierIsRunning', false);

    } else if (state.humidity < humLowerLimit && !(prev.humidifierIsRunning)) {
      console.log('Controller: Too dry, switch humidifier on!');
      remoteSwitch('humidifier', 'on');
      return state.set('humidifierIsRunning', true);
    }

    return state;
  }, initialState);
}

export default humidifierController;
