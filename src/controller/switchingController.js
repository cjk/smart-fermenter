function switchingController(prev, curr) {
  /* Do nothing if fermenter is off */
  if (!curr.get('rts').active) {
    return curr;
  }

  const devices = curr.get('devices').keySeq();

  return devices.reduce((next, dev) => {
    const devPath = ['devices', dev];
    const [cDev, pDev] = [curr.getIn(devPath), prev.getIn(devPath)];

    /* TODO Apply destructuring */
    const lastIsOn = pDev.get('isOn');

    /* Avoids switching non-running devices off and running devices on several times */
    const deviceAlreadyOnOff = (_dev_, shouldSwitchTo) =>
      ((lastIsOn && shouldSwitchTo === 'off') || (!lastIsOn && shouldSwitchTo === 'on'));

    const shouldSwitchTo = cDev.get('shouldSwitchTo');
    /* Decide whether we actually need to switch a device on or off */
    const willSwitch = shouldSwitchTo                           /* 1. Someone indicated a switch is necessary */
                    && deviceAlreadyOnOff(dev, shouldSwitchTo); /* 2. Isn't the device already in desired switch-state? */

    if (willSwitch) {
      // console.log(`>>> We *intend* to switch ${dev} ${shouldSwitchTo}!`);
      return next.mergeIn(['devices', dev],
                          curr.setIn(['devices', dev, 'isOn'], shouldSwitchTo === 'on')
                              .setIn(['devices', dev, 'willSwitch'], true)
                              .getIn(['devices', dev]));
    }
    // console.log(`*No intend* switching ${lastIsOn ? 'already running' : 'not running'} ${dev}`);
    return next.mergeIn(['devices', dev],
                        curr.setIn(['devices', dev, 'willSwitch'], false)
                            .setIn(['devices', dev, 'isOn'], lastIsOn)
                            .getIn(['devices', dev]));
  }, curr);
}

export default switchingController;