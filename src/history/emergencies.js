// @flow
import type { Emergency, FermenterState } from '../types.js'

import * as R from 'ramda'

const histEmergencyPath = ['history', 'emergencies']
const within24Hours = startTs => Math.floor((Date.now() - startTs) / 1000 / 60 / 60 / 24) < 1
const carryoverEmergencies = (prev: FermenterState, curr: FermenterState) => {
  /* Retrieve previous and current emergencies from history-state */
  const [prevEms, currEms] = [R.path(histEmergencyPath, prev), R.path(histEmergencyPath, curr)]

  return R.assocPath(histEmergencyPath, R.concat(R.filter(em => within24Hours(em.at), prevEms), currEms), curr)
}

const addEmergency = (state: FermenterState, em: Emergency) => {
  return R.append(em, R.path(histEmergencyPath, state))
}

export { addEmergency, carryoverEmergencies }
