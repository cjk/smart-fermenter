/* Checks for consecutive occuring emergency-signals and stops (i.e. return
   false) when limit is reached. */
import notify from '../notifications';

/* To send notifications */
const messenger = notify();
const histEmergencyPath = ['history', 'emergencies'];

const emergencyHalt = (state) => {
  const hist = state.getIn(histEmergencyPath);

  /* Return 'halt'-signal when more than one emergency-states occured */
  if (hist && hist.count() > 1) {
    messenger.emit('WARNING: Stopped fermenter-closet on too many Emergency conditions.\nPlease check the devices in the closet and switch them off if necessary.');
    return false;
  }
  return true;
};

export default emergencyHalt;
