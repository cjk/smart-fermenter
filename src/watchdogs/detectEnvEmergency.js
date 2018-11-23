/* Checks for consecutive occuring emergency-signals and signals a
   runtime-emergency when a certain limit is reached. */

import { createNotifier, buildMessage } from '../notifications'

const maxOffScaleReadingsAllowed = 2

const histEmergencyPath = ['history', 'emergencies']
const rtsEnvEmergencyPath = ['rts', 'hasEnvEmergency']

const detectEnvEmergency = (prev, curr) => {
  /* TODO: Emergencies need refactoring! */

  // const emHist = curr.getIn(histEmergencyPath);

  // const now = Date.now();
  // /* Recent emergencies are those that occured in the last 20 seconds */
  // const recentEms = emHist.filter(v => (now - v.at) / 1000 < 20);

  // /* Signal active environmental emergency when two or more *recent* emergency-states occured */
  // const hasEnvEmergency = recentEms.count() > maxOffScaleReadingsAllowed;

  // if (hasEnvEmergency) {
  //   const notice = `There has been more than ${maxOffScaleReadingsAllowed} temperature/humididy measurements exceeding a safe range - please check the fermenter-closet and it's devices for any abnormal conditions!`;
  //   return curr
  //     .update('rts', rtState => createNotifier(rtState, buildMessage(notice, 'warning')))
  //     .setIn(rtsEnvEmergencyPath, hasEnvEmergency);
  // }

  return curr
}

export default detectEnvEmergency
