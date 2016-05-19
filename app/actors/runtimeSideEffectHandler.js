/* Messaging + notifications */
import handleEmergencyNotifications from './messenger';

function handleRuntime(state) {
  const rts = state.get('rts');

  /* First, send pending runtime emergencies, if any */
  handleEmergencyNotifications(rts);

  //   return handleCommands(state);
}

export default handleRuntime;
