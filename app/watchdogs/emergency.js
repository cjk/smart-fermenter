/* Checks for consecutive occuring emergency-signals and stops (i.e. return
   false) when limit is reached. */
import notify from '../notifications';

/* To send notifications */
const messenger = notify();
const histEmergencyPath = ['history', 'emergencies'];

const emergencyHalt = (state) => {
  const emHist = state.getIn(histEmergencyPath);

  const now = Date.now();
  /* Recent emergencies are those that occured in the last 8 seconds */
  const recentEms = emHist.filter(v => ((now - v.at) / 1000) < 8);

  //recentEms.toList().map(v => {
  //console.log(`~~~ Timing: ${((now - v.at) / 1000)}`);
  //});

  /* Return 'halt'-signal when two or more *recent* emergency-states occured */
  if (recentEms.count() < 2)
    return true;

  messenger.emit('WARNING: Stopped fermenter-closet on too many Emergency conditions.\nPlease check the devices in the closet and switch them off if necessary.');

  return false;
};

export default emergencyHalt;
