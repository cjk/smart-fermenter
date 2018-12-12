// @flow

/* Checks for consecutive occuring emergency-signals and signals a
   runtime-emergency when a certain limit is reached. */
import type { FermenterState, Emergency } from '../types'

import * as R from 'ramda'
import signale from 'signale'

const withinNSecs = startTs => Math.floor((Date.now() - startTs) / 1000) <= 5
const maxOffScaleReadingsAllowed = 5

function detectEnvEmergency(prev: FermenterState, curr: FermenterState) {
  const emLst: Array<Emergency> = R.path(['history', 'emergencies'], curr)

  // Recent emergencies are those that occured in the last 10 seconds
  const recentEmergencies = R.filter(e => withinNSecs(e.at), emLst)

  // Also print warning to the console about recent emergencies:
  R.map(
    e => signale.warn(`Recent emergency-state for ${e.device} (${e.sensor} = ${e.value}) detected!`),
    recentEmergencies
  )

  // Signal active environmental emergency when two or more *recent* emergency-states occured
  const hasEnvEmergency: boolean = R.length(recentEmergencies) >= maxOffScaleReadingsAllowed

  if (hasEnvEmergency) {
    const notice = `There has been more than ${maxOffScaleReadingsAllowed} temperature/humididy measurements exceeding a safe range - please check the fermenter-closet and it's devices for any abnormal conditions!`
    const withEmergencies = {
      hasEnvEmergency: R.always(true),
      notifications: R.merge(R.__, { [Date.now()]: { level: 'error', msg: notice } }),
    }

    return R.assoc('rts', R.evolve(withEmergencies, curr.rts), curr)
  }

  return curr
}

export default detectEnvEmergency
