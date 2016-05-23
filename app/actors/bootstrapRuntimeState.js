import {createNotifier, buildMessage} from '../notifications';
import R from 'ramda';

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
    case 'fermenterStart': {
      if (!fermenterIsRunning) {
        newRts = updateRts({active: true, status: 'running', currentCmd: null});
        message = buildMessage('Fermenter was started.');
      }
      break;
    }
    case 'fermenterStop': {
      if (fermenterIsRunning) {
        newRts = updateRts({active: false, status: 'off', currentCmd: null});
        /* IMPORTANT: Make sure we switch all devices off as well as the fermenter-closet! */
        devices = devices.map((dev) => updateDevice(
          dev,
          {shouldSwitchTo: 'off', willSwitch: true, isOn: false})
        );
        message = buildMessage('Fermenter was stopped.');
      }
      break;
    }
    default:
      return newRts;
  }

  const queueMessage = createNotifier(newRts);

  return curr
    .set('rts', queueMessage(message))
    .set('devices', devices);
}

export default bootstrapRuntimeState;
