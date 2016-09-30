import K from 'kefir';
import {getRandomInt} from './random';

const intervalSwitch = () => {
  const start = new Date();
  const randomDelay = getRandomInt(10, 50);

  return K.withInterval(750 + randomDelay, (emitter) => {
    const time = new Date() - start;

    /* Allow a max. time of 4 seconds for switching-actions to take place. Make sure this fits nicely into how often
       sensor-events are emitted! */
    if (time < 4000) {
      emitter.emit(time);
    } else {
      emitter.end();
    }
  });
};

export default function secureSwitching(switchFn) {
  intervalSwitch().onValue(() => switchFn());
}
