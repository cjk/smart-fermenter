const switchController = (prev, curr) =>  {

  const devices = curr.get('devices').keySeq();

  const next = devices.reduce((next, dev) => {

    const devPath = ['devices', dev];
    const [cDev, pDev] = [curr.getIn(devPath), prev.getIn(devPath)];

    /* TODO Apply destructuring */
    const lastIsOn = pDev.get('isOn');

    /* Avoids switching non-running devices off and running devices on several times */
    const deviceAlreadyOnOff = (dev, shouldSwitchTo) => {
      return (lastIsOn && shouldSwitchTo === 'off') || (!lastIsOn && shouldSwitchTo === 'on');
    };

    const lastShouldSwitchTo = pDev.get('shouldSwitchTo');
    const shouldSwitchTo = cDev.get('shouldSwitchTo');
    /* Decide whether we actually need to switch a device on or off */
    const willSwitch = shouldSwitchTo && (lastShouldSwitchTo !== shouldSwitchTo) && deviceAlreadyOnOff(dev, shouldSwitchTo);

    if (willSwitch) {
      console.log(`>>> We *switch* ${dev} ${shouldSwitchTo}!`);
      return next.mergeIn(['devices', dev],
                          curr.setIn(['devices', dev, 'isOn'], shouldSwitchTo === 'on' ? true : false)
                              .setIn(['devices', dev, 'willSwitch'], true)
                              .getIn(['devices', dev]));
    } else {
      console.log(`Not switching ${lastIsOn ? 'already running' : 'not running'} ${dev}`);
      return next.mergeIn(['devices', dev],
                          curr.setIn(['devices', dev, 'willSwitch'], false)
                              .setIn(['devices', dev, 'isOn'], lastIsOn)
                              .getIn(['devices', dev]));
    }
  }, curr);

  /* DEBUGGING */
  //console.log('$ next state:', next);

  return next;
};

export default switchController;
