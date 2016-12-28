import K from 'kefir';
import {getRandomInt} from '../random';

const intervalSwitch = () => {
  let switchCount = 0;
  const start = new Date();
  const randomDelay = getRandomInt(1, 1000);

  return K.withInterval(1000 + randomDelay, (emitter) => {
    const time = new Date() - start;

    /* Allow a max. time of 4 seconds for switching-actions to take place.
     * Also don't switch more than 3 times.
     * NOTE: Make sure this fits nicely into how often
       sensor-events are emitted! */
    if (time < 6000 && switchCount < 3) {
      emitter.emit(time);
      switchCount += 1;
    } else {
      emitter.end();
    }
  });
};

export default function secureSwitching(switchFn) {
  intervalSwitch().onValue(() => switchFn());
}
