/* Checks for consecutive occuring emergency-signals and stops (i.e. return
   false) when limit is reached. */
const histEmergencyPath = ['history', 'emergencies'];

const emergencyHalt = (state) => {
  const hist = state.getIn(histEmergencyPath);

  if (!hist)
    return true;

  /* Return 'halt'-signal when more than 2 emergency-states occured */
  return hist.count() < 3;
};

export default emergencyHalt;
