import temperatureController from './temperatureController';
import humidityController from './humidityController';

const controlledFermenterEnvStream = (envStream) => {
  const t = temperatureController(envStream);
  const h = humidityController(t);

  return h;
};

export default controlledFermenterEnvStream;
