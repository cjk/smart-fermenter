// @flow
import type { Emergency } from '../types'

import * as R from 'ramda'
import { emergency } from '../initialState'

const maxEmergancyEntries = 100
const histEmergencyPath = ['history', 'emergencies']

const carryoverEmergencies = (prev: Emergency, curr: Emergency) => {
  /* Retrieve previous and current emergencies from history-state */
  const [prevEms, currEms] = [R.path(histEmergencyPath, prev), R.path(histEmergencyPath, curr)]

  return R.assocPath(histEmergencyPath, R.concat(prevEms, currEms), curr)
}

const addEmergency = (state, e) => {
  // const history = state.getIn(histEmergencyPath)
  // const emergency = new Record({ [e.at]: new emergency(e) })()

  /* Save a limited number of emergencies in our history-state */
  // return state.setIn(histEmergencyPath, history.concat(emergency).takeLast(maxEmergancyEntries))

  // TODO / PENDING: need to rethink/refactor emergencies, since basically this information belongs to each device, not
  // in a history. And a list of emergencies doesn't make sense since each device / sensor can only have one in the
  // present, while past emergencies don't give us much value!
  return state
}

export { addEmergency, carryoverEmergencies }
