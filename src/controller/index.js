import { pipe } from 'ramda';
import temperatureController from './temperatureController';
import humidityController from './humidityController';

const incIteration = state$ =>
  state$.scan((prev, next) =>
    next.updateIn(
      ['env', 'iterations'],
      _count => prev.get('env').iterations + 1
    )
  );

export default pipe(incIteration, temperatureController, humidityController);
