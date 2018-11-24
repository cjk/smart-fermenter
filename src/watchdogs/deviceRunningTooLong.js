// TODO: Not yet updated - needs refactoring!

/* Checks for devices running for too long and thus might be out-of-control or
   in a bad state. Adds a runtime-emergency in that case. */
import { createNotifier, buildMessage } from '../notifications'

const durationLimit = 15000 * 60 /* allow devices to run at most fifteen minutes */
const deviceHistPath = ['history', 'switchOps']
const rtsDeviceMalfunction = ['rts', 'hasDeviceMalfunction']

const deviceRunningTooLong = (prev, curr) => {
  const switchHist = curr.getIn(deviceHistPath)
  const now = Date.now()
  let noticeTemplate = ''

  const maxDurations = switchHist
    .groupBy(e => e.device) /* Group by device */
    .filter((v, _k) => v.maxBy(c => c.at).to === 'on') /* throw away all that wasn't switched on most recently */
    .map((v, _k) =>
      v.maxBy(sw => sw.at).update(e => now - e.at)
    ) /* replace log-info with simple running-duration in ms  */
    .filter(d => d > durationLimit) /* go further only if breaking our running-limitation */
    .forEach((d, dev) => {
      /* side-effect: build error-message */
      noticeTemplate += `Device <${dev}> has been running for more than ${(durationLimit / 1000 / 60).toFixed(
        1
      )} minutes.\n`
    })
  return curr
    .update('rts', rtState => createNotifier(rtState, buildMessage(noticeTemplate)))
    .setIn(rtsDeviceMalfunction, maxDurations > 0)
}

export default deviceRunningTooLong
