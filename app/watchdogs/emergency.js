const emergencyDetector = (fermenterState) => {
  //return fermenterState.filter(state => state.getIn(['env', 'emergency']))
  //.onValue(state => {
  //console.log(`!!!Emergency-state detected by watchdog!!!`);
  //})
  //.takeWhile(state => !state.getIn(['env', 'emergency']));

  /* Ends stream when emergency-flag is set */
  return fermenterState.takeWhile(state => !state.getIn(['env', 'emergency']));

};

export default emergencyDetector;
