import R from 'ramda';

function fermenterIsActive(rts) {
  return rts.get('active');
}

function _update(rts, props) {
  return rts.withMutations(newRts => {
    return R.map(R.apply(newRts.set.bind(newRts)), R.toPairs(props));
  });
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

  switch (rts.currentCmd) {
    case 'fermenterStart': {
      if (!fermenterIsRunning) {
        newRts = updateRts({active: true, status: 'running', currentCmd: null});
      }
      break;
    }
    case 'fermenterStop': {
      if (fermenterIsRunning) {
        newRts = updateRts({active: false, status: 'off', currentCmd: null});
      }
      break;
    }
    default:
      return curr;
  }

  return curr.set('rts', newRts);
}

export default bootstrapRuntimeState;
