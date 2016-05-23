/* Checks for consecutive occuring emergency-signals and signals a
   runtime-emergency when a certain limit is reached. */
const maxOffScaleReadingsAllowed = 2;

const histEmergencyPath = ['history', 'emergencies'];
const rtsEnvEmergencyPath = ['rts', 'hasEnvEmergency'];

const detectEnvEmergency = (prev, curr) => {
  const emHist = curr.getIn(histEmergencyPath);

  const now = Date.now();
  /* Recent emergencies are those that occured in the last 20 seconds */
  const recentEms = emHist.filter(v => ((now - v.at) / 1000) < 20);

  //recentEms.toList().map(v => {
  //console.log(`~~~ Timing: ${((now - v.at) / 1000)}`);
  //});

  /* Signal active environmental emergency when two or more *recent* emergency-states occured */
  const hasEnvEmergency = (recentEms.count() > maxOffScaleReadingsAllowed);

  return curr.setIn(rtsEnvEmergencyPath, hasEnvEmergency);
};

export default detectEnvEmergency;
