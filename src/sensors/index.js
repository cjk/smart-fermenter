// @flow
import type { FermenterState } from '../types.js'
import type { Observable } from 'kefir'

import * as R from 'ramda'

const isNumeric = n => !isNaN(parseFloat(n)) && isFinite(n)

const device = process.env.NODE_ENV === 'development' ? './simulatedTempHumidity.js' : './tempHumidity.js'

const {default: tempHumStream} = await import(device)

const envTransform = {
  createdAt: Date.now,
  temperature: Number.parseFloat,
  humidity: Number.parseFloat,
}

function createEnvInStateStream(): Observable<Object> {
  return tempHumStream.map((state: FermenterState) => {
    // Add timestamp and convert possible string-numbers to native floats
    const env = R.evolve(envTransform, state.env)
    // Perform a basic first validity-check
    const { temperature, humidity, errors, isValid } = env
    // Only states with valid timestamp + sensor-readings are flagged as valid
    const newEnv =
      !isNumeric(temperature) ||
      !isNumeric(humidity) ||
      temperature === 0 ||
      humidity === 0 ||
      errors > 0 ||
      isValid === false
        ? R.assoc('isValid', false, env)
        : R.assoc('isValid', true, env)

    return R.assoc('env', newEnv, state)
  })
}

export default createEnvInStateStream
