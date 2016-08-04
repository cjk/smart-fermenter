import K from 'kefir';
import {getRandomInt} from './random';

const intervalSwitch = () => {
  const start = new Date();
  const randomDelay = getRandomInt(10, 50);

  return K.withInterval(250 + randomDelay, (emitter) => {
    const time = new Date() - start;

    if (time < 900) {
      emitter.emit(time);
    } else {
      emitter.end();
    }
  });
};

export default function secureSwitching(switchFn) {
  intervalSwitch().onValue(() => switchFn());
}
