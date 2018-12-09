import * as R from 'ramda'
import K from 'kefir'
import sensorLib from 'node-dht-sensor'
import state from '../initialState'

const sensor = {
  initialize: () => sensorLib.initialize(22, 4),
  read: () => sensorLib.read(),
}

function readSensor() {
  const env = sensor.read()

  const trans = {
    temperature: () => Number.parseFloat(env.temperature).toFixed(1),
    humidity: () => Number.parseFloat(env.humidity).toFixed(1),
    errors: R.always(env.errors),
    isValid: R.always(env.isValid),
  }

  return (
    /* Initial state's offspring! */
    /* PENDING: Possible dupe - move this conversion to our general validity-check
     in './index.js' ?! */
    R.pipe(
      R.prop('env'),
      R.evolve(trans),
      R.assoc('env', R.__, state)
    )(state)
  )
}

const sensorStream = sensor.initialize()
  ? K.fromPoll(3000, readSensor) /* Sleep-time between sensor-readings *must* be > 2 seconds! */
      .toProperty()
  : K.constantError('Failed to initialize temp-/humidity-sensor.')

export default sensorStream
