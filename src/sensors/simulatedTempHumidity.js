// @flow
/* eslint no-console: "off", max-len: "off" */

import type { FermenterState } from '../types.js'

import K from 'kefir'
import * as R from 'ramda'
import { getRandomInt } from '../lib/random.js'
import initialState from '../initialState.js'

const interval = 5000

const randomizeEnvironment = (state: FermenterState) =>
  R.pipe(
    R.assocPath(['env', 'temperature'], getRandomInt(25, 35)),
    R.assocPath(['env', 'humidity'], getRandomInt(60, 75))
  )(state)

const _setTempAndHumIn = R.curry((state: FermenterState, temp: number, hum: number) =>
  R.pipe(
    R.assocPath(['env', 'temperature'], temp > 0 ? temp : R.path(['env', 'temperature'], state)),
    R.assocPath(['env', 'humidity'], hum > 0 ? hum : R.path(['env', 'humidity'], state))
  )(state)
)

const setTempAndHumInInitialstate = _setTempAndHumIn(initialState)

const simulatedTempHumStream = K.repeat(n => {
  const run = n + 1

  // console.log('### TEST-RUN #', run);
  switch (run) {
    case 1:
      return K.interval(interval, setTempAndHumInInitialstate(29, 30)).take(1)
    case 2:
      return K.interval(interval, setTempAndHumInInitialstate(23, 0)).take(1)
    case 3:
      return K.interval(interval, setTempAndHumInInitialstate(22, 0)).take(1)
    case 4:
      /* Cause a false alarm emergency */
      /* NOTE that the number of consecutive emergencies before a notification is triggered varies, so this might not be
       * sufficient */
      return K.interval(interval, R.assocPath(['env', 'isValid'], true, setTempAndHumInInitialstate(99, 0))).take(1)
    case 6:
      return K.interval(interval, setTempAndHumInInitialstate(32.1, 0)).take(1)
    case 7:
      return K.interval(interval, setTempAndHumInInitialstate(0, 0)).take(1)
    case 8:
      return K.interval(interval, setTempAndHumInInitialstate(0, 65.1)).take(1)
    case 9:
      return K.interval(interval, setTempAndHumInInitialstate(30, 57)).take(1)
    // case 10:
    // console.log('##### ENDING TEST ######');
    // return false;

    default:
      return K.interval(interval, initialState)
        .map(randomizeEnvironment)
        .take(1)
  }
})

export default simulatedTempHumStream
