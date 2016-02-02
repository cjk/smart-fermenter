import Kefir from 'kefir';
import temperatureController from './temperatureController';
import humidityController from './humidityController';

const controlledFermenterEnvStream = (envStream) => {
  const h = temperatureController(envStream);
  const t = humidityController(envStream);

  return Kefir.combine([h, t], (h, t) => t.merge(h)).toProperty();
};

export default controlledFermenterEnvStream;
