const emergencyDetector = (fermenterState) => {
  /* Ends stream when emergency-flag is set */
  return fermenterState.takeWhile(state => !state.getIn(['env', 'emergency']));
};

export default emergencyDetector;
