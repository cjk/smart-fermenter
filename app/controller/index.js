import R from 'ramda';
import temperatureController from './temperatureController';
import humidityController from './humidityController';

const incIteration = (stream) => stream.scan((prev, next) => next.updateIn(['env', 'iterations'], _i => prev.get('env').iterations + 1));

export default R.pipe(incIteration, temperatureController, humidityController);
