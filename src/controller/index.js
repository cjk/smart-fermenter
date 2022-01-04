// @flow

import * as R from 'ramda'
import temperatureController from './temperatureController.js'
import humidityController from './humidityController.js'

const iterationsLens = R.lensPath(['env', 'iterations'])

const incIteration = state$ =>
  state$.scan((prev, next) => R.set(iterationsLens, R.view(iterationsLens, prev) + 1, next))

export default R.pipe(
  incIteration,
  temperatureController,
  humidityController
)
