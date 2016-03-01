/* Checks for devices running for too long and thus might be out-of-control or
   in a bad state. */
import notify from '../notifications';

const durationLimit = 10000 * 60; /* Ten minutes */

/* To send notifications */
const messenger = notify();
const deviceHistPath = ['history', 'switchOps'];

const deviceRunningTooLong = (state) => {
  const switchHist = state.getIn(deviceHistPath);
  const now = Date.now();
  let noticeTemplate = '';

  const maxDurations = switchHist
                           .groupBy(e => e.device)/* Group by device */
                           .filter((v, k, i) => v.maxBy((c) => c.at).to === 'on')/* throw away all that wasn't switched on most recently */
                           .map((v, k) => v.maxBy(sw => sw.at).update(e => now - e.at))/* replace log-info with simple running-duration in ms  */
                           .filter(d => d > durationLimit)/* go further only if breaking our running-limitation */
                           .forEach((d, dev) => {/* side-effect: build error-message */
                             noticeTemplate += `Device <${dev}> has been running for more than ${(durationLimit / 1000 / 60).toFixed(1)} minutes.\n`;
                           });
  if (maxDurations === 0)
    return true;

  const errorMsg = `ERROR: Stopped fermenter-closet on the following failure-condition:\n ${noticeTemplate} - Please check the devices in the closet ASAP!`;
  messenger.emit(errorMsg);
  return false;
};

export default deviceRunningTooLong;
