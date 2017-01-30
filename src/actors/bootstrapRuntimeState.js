import R from 'ramda';
import {createNotifier, buildMessage} from '../notifications';

function fermenterIsActive(rts) {
  return rts.get('active');
}

function _update(rts, props) {
  return rts.withMutations(newRts =>
    R.map(R.apply(newRts.set.bind(newRts)), R.toPairs(props))
  );
}

function updateDevice(dev, props) {
  return dev.withMutations(newDevState =>
    R.map(R.apply(newDevState.set.bind(newDevState)), R.toPairs(props))
  );
}

function bootstrapRuntimeState(prev, curr) {
  const prevRts = prev.get('rts');

  /* Carry over current fermenter-is-active state from previous state */
  const rts = curr
    .get('rts')
    .set('active', prevRts.active)
    .set('status', prevRts.status);

  const fermenterIsRunning = fermenterIsActive(rts);
  const updateRts = R.partial(_update, [rts]);

  let newRts = rts;
  let devices = curr.get('devices');
  let message = null;

  switch (rts.currentCmd) {
    case 'none': {
      /* Do nothing if no command has been received */
      break;
    }
    case 'start': {
      if (!fermenterIsRunning) {
        newRts = updateRts({active: true, status: 'running', currentCmd: null});
        message = buildMessage('Fermenter was started.');
      }
      break;
    }
    case 'stop': {
      if (fermenterIsRunning) {
        newRts = updateRts({active: false, status: 'off', currentCmd: null});
        /* IMPORTANT: Make sure we switch all devices off as well as the fermenter-closet! */
        devices = devices.map(dev => updateDevice(
          dev,
          {shouldSwitchTo: 'off', willSwitch: true, isOn: false})
        );
        message = buildMessage('Fermenter was stopped.');
      }
      break;
    }
    default: {
      console.warn(`[WARNING] Received unknown command <${rts.currentCmd}> - ignoring.`);
    }
  }

  if (rts.status === 'initializing') {
    newRts = newRts.set('status', fermenterIsRunning ? 'running' : 'off');
  }

  const queueMessage = createNotifier(newRts);

  return curr
    .set('rts', queueMessage(message))
    .set('devices', devices)
    .set('rts', newRts)
  ;
}

export default bootstrapRuntimeState;
